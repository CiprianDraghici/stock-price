import React, {useEffect, useState} from "react";
import {Resolution} from "../enums/resolution.enum";
import {Button, ButtonGroup} from "@material-ui/core";
import ControlLabel from "./panel/ControlLabel";

interface ResolutionsProps {
    resolution?: Resolution;
    handleResolutionChange: (value: Resolution) => void;
}

const Resolutions: React.FC<ResolutionsProps> = (props) => {
    const resolutionOptions = {
        [Resolution.OneMin]: "1min",
        [Resolution.FiveMin]: "5min",
        [Resolution.QuarterHour]: "15min",
        [Resolution.HalfHour]: "30m",
        [Resolution.OneHour]: "1H",
        [Resolution.D]: "Day",
        [Resolution.W]: "Week",
        [Resolution.M]: "Month"
    };

    const [selectedResolution, setSelectedResolution] = useState<string>(props.resolution || Resolution.D);

    useEffect(() => {
        setSelectedResolution(props.resolution || Resolution.D);
    }, [props.resolution]);

    const onChangeResolution = (resolutionOption: string) => (e: React.MouseEvent) => {
        setSelectedResolution(resolutionOption as Resolution);
        props.handleResolutionChange(resolutionOption as Resolution);
    }

    return (
        <ControlLabel text={"Resolution"} useContainer={true}>
            <ButtonGroup size="small" aria-label="small outlined button group" aria-labelledby={"Resolution"}>
                {
                    Object.keys(resolutionOptions).map(option => (
                        // @ts-ignore
                        <Button key={option} className={selectedResolution === option ? "active" : ""} onClick={onChangeResolution(option)}>{resolutionOptions[option]}</Button>
                    ))
                }
            </ButtonGroup>
        </ControlLabel>
    )
}

export default Resolutions;