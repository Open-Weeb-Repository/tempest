import db from "../commons/db";
import {IProjectJob, SearchParam} from "project-jobs";

export const projectJobs = db.get<IProjectJob>("projectScrapeJobs");

export default {
    createJobs(malId: string, type: string, searchParam: SearchParam){
        return projectJobs.insert({
            type,
            malId,
            searchParam,
            n_fail: 0,
            n_done: 0
        });
    }
}
