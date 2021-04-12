import React from "react";

const Tooltip: React.FC<{
    show: boolean,
    position: {
        x: number | string;
        y: number | string;
    };
    content: React.FunctionComponent
}> = (props) => {
    const Content = props.content;

    return (
        props.show ?
        <div className="custom-tooltip" style={{position: "absolute", left: props.position.x, top: props.position.y}}>
            <Content />
        </div> :
        <></>
    )
}

export default Tooltip;