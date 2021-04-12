import {useRef} from "react";

export const useDateRange = () => {
    const startDate = useRef<Date | null>();
    const endDate = useRef<Date | null>();
    return {
        startDate,
        endDate
    };
}