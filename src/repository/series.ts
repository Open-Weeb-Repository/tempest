import db from "../commons/db";
import {IAnimeDetail, IAnimeListItem} from "myanimelist";
import { createHash } from "crypto"
import {IHasTimeStamp} from "tempest.commons";

export const series = db.get<IAnimeDetail & IHasTimeStamp>('series');
series.createIndex("malId")

export default {
    getSeries(seriesItem: IAnimeListItem): Promise<any> {
        return series.findOne({
            malId: this.generateId(seriesItem)
        });
    },

    generateId(seriesItem: IAnimeListItem) {
        const hash = createHash("md5");
        hash.update(seriesItem.malUrl);
        return hash.digest().toString("hex");
    },

    updateOrCreate(seriesData: IAnimeDetail) {
        seriesData.malId = this.generateId(seriesData);
        return series.update({
            malId: seriesData.malId
        }, {
            $set: seriesData,
            $currentDate: {
                updatedAt: true
            },
            $setOnInsert: {
                createdAt: new Date()
            }
        }, {
            upsert: true
        });
    }
}
