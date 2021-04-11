import React, {useEffect, useState} from "react";
import Chart from "./Chart";
import {ChartService} from "../services/chart.service";
import {StockCandle} from "../models/stock-candle.model";
import StockPriceToolbar from "./StockPriceToolbar";
import {Resolution} from "../enums/resolution.enum";
import {DateRange} from "../models/date-range.model";
import {Series} from "../models/series.model";
import moment from "moment";
import Shell from "./panel/Shell";
import Resolutions from "./Resolutions";
import {Box, Card, Divider, Grid} from "@material-ui/core";
import Panel from "./panel/Panel";
import ToggleButton from "./ToggleButton";
import StockSymbol from "./StockSymbol";
import TimeRange from "./TimeRange";
import DateRangesShortcut from "./DateRangesShortcut";
import {DateRanges} from "../enums/date-ranges.enum";

const StockPriceDashboard: React.FC = (props) => {
    const emptyChartData = {
        name: "",
        values: []
    };

    const [stockData, setStockData] = useState<StockCandle | null>(null);
    const [chartData, setChartData] = useState<Series>(emptyChartData);
    const [selectedSymbol, setSelectedSymbol] = useState<string>();
    const [selectedResolution, setSelectedResolution] = useState<Resolution>(Resolution.D);
    const [selectedDateRangeShortcut, setSelectedDateRangeShortcut] = useState<DateRanges>(DateRanges.CurrentDay);
    const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
        startDate: new Date(),
        endDate: new Date()
    });
    const [showAverage, setShowAverage] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getDataAsync();
    }, [selectedSymbol, selectedResolution, selectedDateRange]);

    useEffect(() => {
        const chartService: ChartService = new ChartService();
        if(!stockData) { return; }

        if(stockData.s === "no_data") {
            setChartData(emptyChartData);
            return;
        }

        const series = chartService.buildDataPoints(stockData, {seriesName: selectedSymbol});
        setChartData({
            name: selectedSymbol || "",
            values: series
        });
        setError(null);
    }, [stockData]);

    const getDataAsync = async () => {
        if(!selectedSymbol) { return; }

        const chartService: ChartService = new ChartService();
        try {
            const data = await chartService.getData(selectedSymbol, selectedResolution || Resolution.M, "1572651390", "1575243390");
            // const data = await chartService.getData(selectedSymbol, selectedResolution || Resolution.D, moment(selectedDateRange.start).unix().toString(), moment(selectedDateRange.end).unix().toString());
            console.log(data);
            setStockData(data as StockCandle);
        } catch (err) {
            setError(err.message);
        }
    }

    const onSymbolChange = (value: string) => {
        setSelectedSymbol(value);
    }

    const onResolutionChange = (value: Resolution) => {
        setSelectedResolution(value);
    }

    const onDateRangeChange = (value: DateRange) => {
        setSelectedDateRange(value);
    }

    const onDateRangeShortcutChange = (selectedDateRange: DateRanges, value: DateRange) => {
        setSelectedDateRangeShortcut(selectedDateRange);
        setSelectedDateRange(value);
    }

    const onShowAverageChange = (value: boolean) => {
        setShowAverage(value);
    }


    return (
        <div>
            <Shell settingsComponent={
                    <Panel>
                        <StockSymbol handleSymbolChange={onSymbolChange} />
                        <Box display="flex" flexDirection="row" flexWrap="nowrap" justifyContent="flex-start" alignItems="flex-start" alignContent="flex-start">
                            <ToggleButton label={"Show average"} handleShowStateChange={onShowAverageChange} />
                        </Box>
                        <Box display="flex" flexDirection="row" flexWrap="nowrap" justifyContent="flex-start" alignItems="flex-start" alignContent="flex-start">
                            <Resolutions selectedResolution={selectedResolution} handleResolutionChange={onResolutionChange} />
                        </Box>
                        <Box display="flex" flexDirection="row" flexWrap="nowrap" justifyContent="flex-start" alignItems="flex-start" alignContent="flex-start">
                            <TimeRange dateRange={selectedDateRange} handlePeriodChange={onDateRangeChange} />
                        </Box>
                        {/*<StockPriceToolbar handleSymbolChange={onSymbolChange} handleResolutionChange={onResolutionChange} handleDateRangeChange={onDateRangeChange} handleShowAverageChange={onShowAverageChange} />*/}
                    </Panel>
                }
                contentComponent={
                    <>
                        { error }
                        {
                            !error &&
                            <>
                                <Chart data={chartData} showAverage={showAverage} />
                                <DateRangesShortcut selectedDateRange={selectedDateRangeShortcut} handleDateRangeChange={onDateRangeShortcutChange} />
                            </>
                            // <Resolutions selectedResolution={selectedResolution} handleResolutionChange={onResolutionChange} />
                        }
                    </>
                }
            >
            </Shell>
        </div>
    )
}

export default StockPriceDashboard;