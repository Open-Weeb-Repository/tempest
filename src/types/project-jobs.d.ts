export interface IProjectJob {
    provider: string;
    malId: string;
    n_fail: number;
    n_done: number;
    searchParam: SearchParam;
    state: 'active'
}

export type SearchParam = string[];
