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
import {ChartSettingsService} from "../services/chart-settings.service";

const StockPriceDashboard: React.FC = (props) => {
    const chartService: ChartService = new ChartService();
    const chartSettings: ChartSettingsService = ChartSettingsService.getInstance();

    const emptyChartData = {
        name: "",
        values: []
    };

    const [stockData, setStockData] = useState<StockCandle | null>(null);
    const [chartData, setChartData] = useState<Series>(emptyChartData);

    const [selectedDateRangeShortcut, setSelectedDateRangeShortcut] = useState<DateRanges>(DateRanges.CurrentDay);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const settings = chartSettings.getSettings();
        if(!settings) { return; }

        getDataAsync(settings);
    }, []);

    useEffect(() => {
        if(!stockData) { return; }

        if(stockData.s === "no_data") {
            setChartData(emptyChartData);
            return;
        }

        setIsLoading(true);

        const settings = chartSettings.getSettings();
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

    const onApplySettings = (settings: StockSettings) => {
        getDataAsync(settings);
    }

    const onDateRangeShortcutChange = (selectedDateRange: DateRanges, value: DateRange) => {
        setSelectedDateRangeShortcut(selectedDateRange);
        chartSettings.setSpecificProperty("dateRange", value);
        onApplySettings(chartSettings.getSettings());
    }

    const getLoadingIndicatorContainer = () => {
        return document.getElementById("LoadingIndicatorContainer");
    }

    return (
        <Shell
            settingsComponent={<ChartSettingsPanel handleApplySettings={onApplySettings} />}
            contentComponent={
                <>
                    { error }
                    {
                        !error &&
                        <>
                            <Chart data={chartData} showAverage={chartSettings.getSettings()?.showAverage} />
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