import * as React from "react";
import {ClassAttributes, HTMLAttributes} from "react";
import {DOMAttributes} from "react";
import {Grid} from "@material-ui/core";

interface ControlLabelProps extends ClassAttributes<any>, DOMAttributes<any>, HTMLAttributes<any> {
    text: string;
}

const ControlLabel: React.FC<ControlLabelProps> = (props) => {
    return(
        <Grid container justify="space-between">
            <span style={{float: "left"}}>{`${props.text}`}</span>
            {props.children}
        </Grid>
    );
}

export default ControlLabel;