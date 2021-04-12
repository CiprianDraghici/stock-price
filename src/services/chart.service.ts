import {HttpService} from "./http.service";
import {ChartServiceContract} from "../contracts/chart-service.contract";
import {StockCandle} from "../models/stock-candle.model";
import {Resolution} from "../enums/resolution.enum";
import {StockSymbol} from "../models/stock-symbol.model";
import {SeriesPoint} from "../models/series-point.model";

export class ChartService implements ChartServiceContract {
    private static instance: ChartService;

    public static getInstance(): ChartService {
        if (!ChartService.instance) {
            ChartService.instance = new ChartService();
        }

        return ChartService.instance;
    }

    public async getSymbols(): Promise<StockSymbol[] | null> {
        const httpService: HttpService = HttpService.getInstance();

        try {
            const response = await httpService.get<string[]>(`${httpService.baseUrl}/stock/symbol?exchange=US&token=${sessionStorage.accessToken}`);

            if (response.status !== 200) {
                httpService.handleRejection(response);
                return null;
            }

            return response.parsedBody as any[] || [];
        } catch (err) {
            httpService.handleRejection(err);
            return null;
        }
    }

    public async getData(symbol: string, resolution: Resolution, from: string, to: string): Promise<StockCandle | undefined> {
        const httpService: HttpService = HttpService.getInstance();

        try {
            const response = await httpService.get<StockCandle>(`${httpService.baseUrl}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${sessionStorage.accessToken}`);

            if (response.status !== 200) {
                httpService.handleRejection(response);
            }

            return response.parsedBody as StockCandle;
        } catch (err) {
            httpService.handleRejection(err);
        }
    }

    public buildDataPoints(model: StockCandle, customProps?: object) {
        return [...model.c.reduce((acc, curr, idx) => {
                const x = new Date(model.t[idx]*1000);
                acc.push({
                    x,
                    y: curr,
                    ...customProps
                })
                return acc;
            }, [] as SeriesPoint[])
        ];
    }
}