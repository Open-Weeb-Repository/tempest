import db from "../commons/db";
import {ProjectProvider, ProviderType} from "project-providers";

export const projectProviders = db.get<ProjectProvider>("projectProviders");

projectProviders.createIndex('type');

let tempProvider: ProjectProvider[];

export default {
    getProviderByType(type: ProviderType) {
        return projectProviders.find({
            type
        });
    },

    async getProviderLazy(type: ProviderType){
        if (!tempProvider) {
            tempProvider = await this.getProviderByType(type);
        }
        return tempProvider;
    },

    clearTempProvider(){
      tempProvider = undefined;
    }
}
