import axios from 'axios';
import cheerio from 'cheerio';

export default async function (url: string): Promise<CheerioStatic> {
    const body = await axios.get<string>(encodeURI(url));
    return cheerio.load(body.data);
}
