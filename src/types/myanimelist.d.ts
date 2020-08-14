export interface IAnimeListItem {
    malId?: string;
    malUrl: string;
}

interface IAnimeTitle {
    mainTitle: string;
    synonyms: string[];
    titleJp: string;
}

export interface IAnimeDetail extends IAnimeListItem {
    title: IAnimeTitle;
    image: string;
    synopsis: string;
    background: string;
    malType: "anime";
    type: string;
    episodes: number;
    premiered: string;
    broadcast: string;
    producers: string[];
    licensors: string[];
    studios: string[];
    source: string;
    genres: string[];
    duration: string;
    rating: string;
    score: number;
}
