import debug from "debug";
import config from "config";
import getpage from "./helpers/getpage";
import * as MyAnimeList from 'myanimelist.d.ts';
import parseSeasonalAnimePage from './parsers/myanimelist.parse-seasonal-anime-page'
import parseAnimeDetail from './parsers/myanimelist.parse-anime';
import seriesRepo from "./repository/series";
import chunkProcess from "./helpers/chunk-process";
import projectJobsRepo from "./repository/project-jobs";
import {SearchParam} from "project-jobs.d.ts";
import projectProviderRepo from "./repository/project-providers";

const log = debug('tempest:app');
const logProcess = debug('tempest:app:process');

interface IAppOption {
    nProcessChunk?: number
}

export class App {
    private readonly nProcessChunk: number;

    constructor(options: IAppOption = {}) {
        log('Creating app instance');
        this.nProcessChunk = options.nProcessChunk || parseInt(config.get('processChunkSize'), 10);
        if (this.nProcessChunk < 1) {
            throw new Error('Number of process chunk must be larger than 0');
        }
    }

    async start() {
        log('Getting seasonal animes');
        const seasonalAnimes = await this.getSeasonalAnime();
        log('Processing %d seasonal anime', seasonalAnimes.length);
        await chunkProcess<MyAnimeList.IAnimeListItem>(seasonalAnimes, this.processAnime, this.nProcessChunk);
        projectProviderRepo.clearTempProvider();
    }

    async getSeasonalAnime(): Promise<MyAnimeList.IAnimeListItem[]> {
        const $ = await getpage(config.get<string>('seasonalUrl'));
        log('parse seasonal page');
        return parseSeasonalAnimePage($);
    }

    async processAnime(anime: MyAnimeList.IAnimeListItem) {
        logProcess("anime-%s: processing started", anime.malUrl);
        const animeDetail = await App.getAnimeData(anime);
        logProcess("anime-%s: Retreived from provider", anime.malUrl);
        /* save or create new */
        await seriesRepo.updateOrCreate(animeDetail)
        let malId = seriesRepo.generateId(anime);
        let searchParam: SearchParam = [
            animeDetail.title.mainTitle,
            ...animeDetail.title.synonyms,
            animeDetail.title.titleJp
        ];

        // check new provider for this job
        const existingWorkerProviderNames = await projectJobsRepo.getAllWorkerNameByMalId(malId);
        const allProviders = await projectProviderRepo.getProviderLazy('anime');
        const newProviders = allProviders
            .filter(val => !existingWorkerProviderNames.includes(val.workerJobName));
        if (newProviders.length > 0) {
            await projectJobsRepo.createJobs(newProviders, malId, animeDetail.malType, searchParam);
            logProcess("anime-%s: %d active-project-parse job created!", anime.malUrl, newProviders.length);
        }
    }

    private static async getAnimeData(anime: MyAnimeList.IAnimeListItem): Promise<MyAnimeList.IAnimeDetail> {
        const $ = await getpage(anime.malUrl);
        return parseAnimeDetail($);
    }
}
