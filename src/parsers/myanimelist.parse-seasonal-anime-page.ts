import {IAnimeListItem} from 'myanimelist';

export default function ($: CheerioStatic): IAnimeListItem[] {
    return $(".js-seasonal-anime")
        .map(function ():IAnimeListItem {
            const $this = $(this);
            const titleLink = $this.find('.title-text a').attr("href");
            return {
                malUrl: titleLink,
                malId: titleLink.split("/")[4]
            }
        }).get();
}
