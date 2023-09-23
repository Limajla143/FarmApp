import { useEffect } from "react";
import { agriTypeSelectors, getAgriTypes } from "../../features/agriTypes/agriTypeSlice";
import { useAppDispatch, useAppSelector } from "../store/configStore";

export default function useAgriTypes() {
    const agriTypelists = useAppSelector(agriTypeSelectors.selectAll);
    const {agriloaded, metaData} = useAppSelector(state => state.agritype);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!agriloaded) dispatch(getAgriTypes());
    }, [agriloaded, dispatch])
    return {
        agriTypelists, agriloaded, metaData
    }
}

