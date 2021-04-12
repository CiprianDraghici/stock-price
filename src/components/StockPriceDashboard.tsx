import React, {useEffect, useState} from "react";
import Chart from "./Chart";
import {ChartService} from "../services/chart.service";
import {StockCandle} from "../models/stock-candle.model";
import {Resolution} from "../enums/resolution.enum";
import {DateRange} from "../models/date-range.model";
import {Series} from "../models/series.model";
import Shell from "./panel/Shell";
import DateRangesShortcut from "./DateRangesShortcut";
import {DateRanges} from "../enums/date-ranges.enum";
import ChartSettingsPanel from "./ChartSettingsPanel";
import {StockSettings} from "../models/stock.settings";
import LoadingIndicator from "./LoadingIndicator";
import ReactDOM from "react-dom";

const StockPriceDashboard: React.FC = (props) => {
    const emptyChartData = {
        name: "",
        values: []
    };

    const [stockData, setStockData] = useState<StockCandle | null>(null);
    const [chartData, setChartData] = useState<Series>(emptyChartData);

    const [selectedDateRangeShortcut, setSelectedDateRangeShortcut] = useState<DateRanges>(DateRanges.CurrentDay);
    const [settings, setSettings] = useState<StockSettings>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getDataAsync(settings);
    }, []);

    useEffect(() => {
        getDataAsync(settings);
    }, [settings]);

    useEffect(() => {
        const chartService: ChartService = new ChartService();
        if(!stockData) { return; }

        if(stockData.s === "no_data") {
            setChartData(emptyChartData);
            return;
        }

        setIsLoading(true);
        const series = chartService.buildDataPoints(stockData, {seriesName: settings?.symbol});
        setChartData({
            name: settings?.symbol || "",
            values: series
        });
        setIsLoading(false);

        setError(null);
    }, [stockData]);

    const getDataAsync = async (settings?: StockSettings) => {
        if(!settings || !settings.symbol) { return; }

        const chartService: ChartService = new ChartService();
        try {
            setIsLoading(true);
            const data = await chartService.getData(settings.symbol, settings.resolution || Resolution.M, "1572651390", "1575243390");
            // const data = await chartService.getData(settings.symbol, settings.resolution || Resolution.M, moment(settings.dateRange?.startDate).unix().toString(), moment(settings.dateRange?.endDate).unix().toString());
            console.log(data);
            setIsLoading(false);
            setStockData(data as StockCandle);
        } catch (err) {
            setError(err.message);
        }
    }

    const handleApplySettings = (settings: StockSettings) => {
        setSettings(settings);
    }

    const onDateRangeShortcutChange = (selectedDateRange: DateRanges, value: DateRange) => {
        setSelectedDateRangeShortcut(selectedDateRange);
        setSettings({
            ...settings,
            dateRange: value
        } as StockSettings)
    }

    const getLoadingIndicatorContainer = () => {
        return document.getElementById("LoadingIndicatorContainer");
    }

    return (
        <Shell
            settingsComponent={<ChartSettingsPanel handleApplySettings={handleApplySettings} />}
            contentComponent={
                <>
                    { error }
                    {
                        !error &&
                        <>
                            <Chart data={chartData} showAverage={settings?.showAverage} />
                            {
                                isLoading &&
                                ReactDOM.createPortal(<LoadingIndicator />, getLoadingIndicatorContainer()!)
                            }
                            <DateRangesShortcut selectedDateRange={selectedDateRangeShortcut} handleDateRangeChange={onDateRangeShortcutChange} />
                        </>
                    }
                </>
            }
        >
        </Shell>
    )
}

export default StockPriceDashboard;