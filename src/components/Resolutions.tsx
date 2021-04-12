import React, {useEffect, useState} from "react";
import {Resolution} from "../enums/resolution.enum";
import {Button, ButtonGroup} from "@material-ui/core";
import ControlLabel from "./panel/ControlLabel";

interface ResolutionsProps {
    resolution?: Resolution;
    handleResolutionChange: (value: Resolution) => void;
}

const Resolutions: React.FC<ResolutionsProps> = (props) => {

    const [selectedResolution, setSelectedResolution] = useState<string>(props.resolution || Resolution.D);
    const resolutionOptions = [ ...Object.keys(Resolution).filter(key => typeof key === "string") ];

    useEffect(() => {
        setSelectedResolution(props.resolution || Resolution.D);
    }, [props.resolution]);

    const onChangeResolution = (resolutionOption: string) => (e: React.MouseEvent) => {
        setSelectedResolution(resolutionOption);
        // @ts-ignore
        props.handleResolutionChange(Resolution[resolutionOption]);
    }

    return (
        <ControlLabel text={"Resolution"} useContainer={true}>
            <ButtonGroup size="small" aria-label="small outlined button group" aria-labelledby={"Resolution"}>
                {
                    resolutionOptions.map(option => (
                        <Button key={option} className={selectedResolution === option ? "active" : ""} onClick={onChangeResolution(option)}>{option}</Button>
                    ))
                }
            </ButtonGroup>
        </ControlLabel>
    )
}

export default Resolutions;