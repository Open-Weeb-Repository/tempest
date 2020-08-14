import debug from "debug";
import config from "config";
import getpage from "./helpers/getpage";
import * as MyAnimeList from 'myanimelist';
import parseSeasonalAnimePage from './parsers/myanimelist.parse-seasonal-anime-page'

const log = debug('tempest:app');

export class App {
    constructor() {
        log('Creating app instance');
    }

    async start(){
        log('Getting seasonal animes');
        const seasonalAnime = await this.getSeasonalAnime();
    }

    async getSeasonalAnime(): Promise<MyAnimeList.IAnimeListItem[]> {
        const $ = await getpage(config.get<string>('seasonalUrl'));
        log('parse seasonal page');
        return parseSeasonalAnimePage($);
    }
}
