export default function chunk<T> (arr:T[], len: number): T[][] {
    let chunks = [],
        i = 0,
        n = arr.length;

    while (i < n) {
        chunks.push(arr.slice(i, i += len));
    }
    return chunks;
}
