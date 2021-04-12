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
import ToggleButton from "./ToggleButton";
import {Box} from "@material-ui/core";
import MaximizeIcon from '@material-ui/icons/Maximize';
import MinimizeIcon from '@material-ui/icons/Minimize';
import RemoveIcon from '@material-ui/icons/Remove';

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
    const [showAverage, setShowAverage] = useState<boolean>(false);
    const [showMin, setShowMin] = useState<boolean>(false);
    const [showMax, setShowMax] = useState<boolean>(false);
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

    const onShowAverageChange = (value: boolean) => {
        setShowAverage(value);
    }

    const onShowMinChange = (value: boolean) => {
        setShowMin(value);
    }

    const onShowMaxChange = (value: boolean) => {
        setShowMax(value);
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
                            <Chart data={chartData} showMin={showMin} showAverage={showAverage} showMax={showMax} />
                            {
                                isLoading &&
                                ReactDOM.createPortal(<LoadingIndicator />, getLoadingIndicatorContainer()!)
                            }

                            <Box display="flex" flexDirection="row" flexWrap="nowrap" justifyContent="center" alignItems="flex-start" alignContent="flex-start">
                                <DateRangesShortcut selectedDateRange={selectedDateRangeShortcut} handleDateRangeChange={onDateRangeShortcutChange} />
                                <div style={{marginLeft: 20}}>
                                    <ToggleButton label={"Min"} value={showMin} handleShowStateChange={onShowMinChange}> <MinimizeIcon/> </ToggleButton>
                                    <ToggleButton label={"Average"} value={showAverage} handleShowStateChange={onShowAverageChange}> <RemoveIcon/> </ToggleButton>
                                    <ToggleButton label={"Max"} value={showMax} handleShowStateChange={onShowMaxChange}><MaximizeIcon/> </ToggleButton>
                                </div>
                            </Box>
                        </>
                    }
                </>
            }
        >
        </Shell>
    )
}

export default StockPriceDashboard;