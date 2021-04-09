export interface StockCandle {
    c: number[];
    h: number[];
    l: number[];
    o: number[];
    s: "ok" | "no_data";
    t: number[];
    v: number[];
}