import * as React from "react";
import {Grid} from "@material-ui/core";

interface ControlLabelProps {
    text: string;
    useContainer?: boolean;
}

const ControlLabel: React.FC<ControlLabelProps> = (props) => {
    return(
        <Grid container={props.useContainer} justify="space-between">
            <span style={{float: "left"}}>{`${props.text}`}</span>
            {props.children}
        </Grid>
    );
}

export default ControlLabel;