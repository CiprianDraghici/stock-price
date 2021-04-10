import React, {useState} from "react";
import {Resolution} from "../enums/resolution.enum";
import {Button, ButtonGroup} from "@material-ui/core";

interface ResolutionsProps {
    selectedResolution?: Resolution;
    handleResolutionChange: (value: Resolution) => void;
}

const Resolutions: React.FC<ResolutionsProps> = (props) => {
    const [selectedResolution, setSelectedResolution] = useState<string>(props.selectedResolution || Resolution.D);

    const resolutionOptions = [ ...Object.keys(Resolution).filter(key => typeof key === "string") ];

    const onChangeResolution = (resolutionOption: string) => (e: React.MouseEvent) => {
        setSelectedResolution(resolutionOption);
        // @ts-ignore
        props.handleResolutionChange(Resolution[resolutionOption]);
    }

    return (
        <ButtonGroup size="small" aria-label="small outlined button group">
            {
                resolutionOptions.map(option => (
                    <Button key={option} color={selectedResolution === option ? "primary" : undefined} onClick={onChangeResolution(option)}>{option}</Button>
                ))
            }
        </ButtonGroup>
    )
}

export default Resolutions;