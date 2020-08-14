import chunk from "./chunk";

export default async function chunkProcess <T, R = void>(items: T[], process: (item: T) => Promise<R>, nChunk = 1): Promise<R[]> {
    const chunkedItem = chunk<T>(items, nChunk);
    const result: R[] = [];
    for (let chunkedItemElement of chunkedItem) {
        result.push(...await Promise.all(chunkedItemElement.map(item => process(item))));
    }
    return result;
}
