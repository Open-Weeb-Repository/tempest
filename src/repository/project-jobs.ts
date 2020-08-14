import db from "../commons/db";
import {IProjectJob, SearchParam} from "project-jobs";
import {IHasCreatedAt} from "tempest.commons";

export const projectJobs = db.get<IProjectJob & IHasCreatedAt>("projectScrapeJobs");

export default {
    createJobs(malId: string, type: string, searchParam: SearchParam){
        return projectJobs.insert({
            type,
            malId,
            searchParam,
            n_fail: 0,
            n_done: 0,
            createdAt: new Date()
        });
    }
}
