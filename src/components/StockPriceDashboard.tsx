import React, {useEffect, useState} from "react";
import Chart from "./Chart";
import {ChartService} from "../services/chart.service";
import {StockCandle} from "../models/stock-candle.model";
import StockPriceToolbar from "./StockPriceToolbar";
import {Resolution} from "../enums/resolution.enum";
import {DataPoint} from "../models/data-point.model";
import {DateRange} from "../models/date-range.model";
import moment from "moment";

const StockPriceDashboard: React.FC = (props) => {
    const [remoteData, setRemoteData] = useState<StockCandle | null>(null);
    const [chartData, setChartData] = useState<DataPoint[]>([]);
    const [selectedSymbol, setSelectedSymbol] = useState<string>();
    const [selectedResolution, setSelectedResolution] = useState<Resolution>(Resolution.D);
    const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
        start: new Date(),
        end: new Date()
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setChartData([]);
    }, []);

    useEffect(() => {
        getDataAsync();
    }, [selectedSymbol, selectedResolution, selectedDateRange]);

    useEffect(() => {
        const chartService: ChartService = new ChartService();
        if(!remoteData) { return; }

        if(remoteData.s === "no_data") {
            setChartData([]);
            return;
        }

        setChartData(chartService.buildDataPoints(remoteData, {size: 20, seriesName: selectedSymbol}));
    }, [remoteData]);

    const getDataAsync = async () => {
        if(!selectedSymbol) { return; }

        const chartService: ChartService = new ChartService();
        try {
            const data = await chartService.getData(selectedSymbol, selectedResolution || Resolution.D, "1572651390", "1575243390");
            // const data = await chartService.getData(selectedSymbol, selectedResolution || Resolution.D, moment(selectedDateRange.start).unix().toString(), moment(selectedDateRange.end).unix().toString());
            console.log(data);
            setRemoteData(data as StockCandle);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div>
            <StockPriceToolbar handleSymbolSelection={setSelectedSymbol} />
            {
                error
            }
            {
                !error &&
                <Chart data={[...chartData]}/>
            }
        </div>
    )
}

export default StockPriceDashboard;