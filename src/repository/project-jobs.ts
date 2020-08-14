import db from "../commons/db";
import {IProjectJob, SearchParam} from "project-jobs.d.ts";
import {IHasCreatedAt} from "tempest.commons";
import {ProjectProvider} from "project-providers";

export const projectJobs = db.get<IProjectJob & IHasCreatedAt>("projectScrapeJobs");

export default {
    createJobs(providers: ProjectProvider[],malId: string, type: string, searchParam: SearchParam){
        const createdAt = new Date();
        return projectJobs.insert(providers.map(provider => {
            return {
                provider: provider.workerJobName,
                malId,
                searchParam,
                n_fail: 0,
                n_done: 0,
                createdAt,
                state: 'active',
            }
        }));
    }
}
