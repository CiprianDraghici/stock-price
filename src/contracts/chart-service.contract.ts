import {StockCandle} from "../models/stock-candle.model";
import {Resolution} from "../enums/resolution.enum";
import {SeriesPoint} from "../models/series-point.model";

export interface ChartServiceContract {
    getData: (symbol: string, resolution: Resolution, from: string, to: string) => Promise<StockCandle | undefined>;
    buildDataPoints: (model: StockCandle, customProps?: object) => SeriesPoint[];
}