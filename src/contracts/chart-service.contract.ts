import {StockCandle} from "../models/stock-candle.model";
import {DataPoint} from "../models/data-point.model";
import {Resolution} from "../enums/resolution.enum";

export interface ChartServiceContract {
    getData: (symbol: string, resolution: Resolution, from: string, to: string) => Promise<StockCandle | undefined>;
    buildDataPoints: (model: StockCandle, customProps?: object) => DataPoint[];
}