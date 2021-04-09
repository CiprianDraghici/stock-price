import {toast} from "react-toastify";
import {Resolution} from "../enums/resolution.enum";
// @ts-ignore
import * as finnhub from "finnhub";

export interface IHttpResponse<T> extends Response {
    parsedBody?: T;
}

export class FinnhubService {
    private static instance: FinnhubService;
    private readonly api_key = finnhub.ApiClient.instance.authentications['api_key'];
    private readonly finnhubClient = new finnhub.DefaultApi();

    constructor() {
        this.api_key.apiKey = sessionStorage.accessToken;
    }

    public static getInstance(): FinnhubService {
        if (!FinnhubService.instance) {
            FinnhubService.instance = new FinnhubService();
        }

        return FinnhubService.instance;
    }

    public getStockCandles = async (symbol: string, resolution: Resolution, from: string, to: string) => {
        const callback = (error: any, data: any, response:any) => {
            console.log(data);
            console.log(error);
            console.log(response);
        };
        this.finnhubClient.stockCandles("AAPL", "D", 1590988249, 1591852249, {}, callback);

        const result = await this.finnhubClient.stockCandles("AAPL", "D", 1590988249, 1591852249, {}).json();
        console.log(result);
        return result;
    };

    // public currentSymbol = fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${sessionStorage.accessToken}`)
    //     .then((res) => {
    //         return res.json();
    //     }).then((results) => {
    //         return results.map(result => {
    //             return result
    //         })
    //     })
}