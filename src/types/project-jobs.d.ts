export interface IProjectJob {
    type: string;
    malId: string;
    n_fail: number;
    n_done: number;
    searchParam: SearchParam
}

export type SearchParam = string[];
