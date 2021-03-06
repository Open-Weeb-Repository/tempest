import {IAnimeDetail} from "myanimelist.d.ts";

interface ISidebarParser {
    [Key: string]: (value: string, out: IAnimeDetail,type: string, $ele: Cheerio) => void;
}

const sidebarParser: ISidebarParser = {};

export default function ($: CheerioStatic): IAnimeDetail {
    const url = $(".breadcrumb .di-ib:nth-child(3) a").attr("href");
    const obj:IAnimeDetail = {
        malType: "anime",
        malUrl: url,
        background: "",
        broadcast: "",
        duration: "",
        episodes: 0,
        genres: [],
        image: "",
        licensors: [],
        premiered: "",
        producers: [],
        rating: "",
        source: "",
        studios: [],
        synopsis: $("span[itemprop='description']").text(),
        title: {
            mainTitle: "",
            titleJp: undefined,
            synonyms: []
        },
        type: "anime",
        score: 0
    }
    const $title = $(".h1-title span[itemprop='name']");
    const $engTitle = $title.find(".title-english");
    obj.title.mainTitle = $title.text();
    if ($engTitle.length > 0) {
        obj.title.mainTitle = obj.title.mainTitle.replace($engTitle.text(),"");
        obj.title.synonyms.push($engTitle.text());
    }
    const $sidebar = $("#content > table > tbody > tr > td:nth-child(1) > div");
    $sidebar.find("div").each(function (){
        const $this = $(this);
        let type = $this.find(".dark_text").text();
        if (!type) {
            return;
        }
        let value = $this.text().trim();
        value = value.replace(type, "").trim().replace(/\s\s+/g, ' ');
        // console.log(type);
        if (sidebarParser.hasOwnProperty(type)) {
            sidebarParser[type](value, obj, type, $this);
        }
    });
    obj.image = $sidebar.find("img").data("src");
    return obj;
}

sidebarParser["Synonyms:"] = (value, out) => {
    out.title.synonyms.push(...value.split(',').map(val => val.trim()));
}

sidebarParser["Japanese:"] = (value, out) => {
    out.title.titleJp = value;
}

sidebarParser["Type:"] = (value, out) => {
    out.type = value;
}

sidebarParser["Episodes:"] = (value, out) => {
    out.episodes = value === 'Unknown' ? null : parseInt(value, 10);
}

sidebarParser["Premiered:"] = (value, out) => {
    out.premiered = value;
}

sidebarParser["Broadcast:"] = (value, out) => {
    out.broadcast = value;
}

sidebarParser["Producers:"] = (value, out) => {
    if (value.trim().toLowerCase() === "none found, add some") {
        return;
    }
    out.producers = value.split(',').map(val => val.trim());
}

sidebarParser["Licensors:"] = (value, out) => {
    if (value.trim().toLowerCase() === "none found, add some") {
        return;
    }
    out.licensors = value.split(',').map(val => val.trim());
}

sidebarParser["Studios:"] = (value, out) => {
    if (value.trim().toLowerCase() === "none found, add some") {
        return;
    }
    out.studios = value.split(',').map(val => val.trim());
}

sidebarParser["Source:"] = (value, out) => {
    if (value.trim().toLowerCase() === "none found, add some") {
        return;
    }
    out.source = value;
}

sidebarParser["Genres:"] = (value, out) => {
    if (value.trim().toLowerCase() === "none found, add some") {
        return;
    }
    out.genres = value.split(',').map(genre => {
        return genre.trim().slice(genre.length / 2);
    });
}

sidebarParser["Duration:"] = (value, out) => {
    out.duration = value;
}

sidebarParser["Rating:"] = (value, out) => {
    out.rating = value;
}

sidebarParser["Score:"] = (value, out, type, $ele) => {
    out.score = parseFloat($ele.find("span.score-label").text());
}
