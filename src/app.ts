import debug from "debug";
import config from "config";
import getpage from "./helpers/getpage";
import * as MyAnimeList from 'myanimelist';
import parseSeasonalAnimePage from './parsers/myanimelist.parse-seasonal-anime-page'
import parseAnimeDetail from './parsers/myanimelist.parse-anime';
import seriesRepo from "./repository/series";
import chunkProcess from "./helpers/chunk-process";

const log = debug('tempest:app');
const logProcess = debug('tempest:app:process');

interface IAppOption {
    nProcessChunk?: number
}

export class App {
    private readonly nProcessChunk: number;
    constructor(options: IAppOption = {}) {
        log('Creating app instance');
        this.nProcessChunk = options.nProcessChunk || 4;
        if (this.nProcessChunk < 1){
            throw new Error('Number of process chunk must be larger than 0');
        }
    }

    async start(){
        log('Getting seasonal animes');
        const seasonalAnimes = await this.getSeasonalAnime();
        log('Processing all seasonal anime');
        await chunkProcess<MyAnimeList.IAnimeListItem>(seasonalAnimes, this.processAnime, this.nProcessChunk);
    }

    async getSeasonalAnime(): Promise<MyAnimeList.IAnimeListItem[]> {
        const $ = await getpage(config.get<string>('seasonalUrl'));
        log('parse seasonal page');
        return parseSeasonalAnimePage($);
    }

    async processAnime(anime: MyAnimeList.IAnimeListItem){
        logProcess("Get existing anime series data");
        const animeDetail = await App.getAnimeData(anime);
        /* save or create new */
        const result = await seriesRepo.updateOrCreate(animeDetail) as any; // monk typing not match the return value
        if (result.upserted) {
            /* new document created, add to jobs */
            console.log('upserted');
        }
    }

    private static async getAnimeData(anime: MyAnimeList.IAnimeListItem): Promise<MyAnimeList.IAnimeDetail> {
        const $ = await getpage(anime.malUrl);
        return parseAnimeDetail($);
    }
}
