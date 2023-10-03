import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/configStore";
import { getUsersAdmin, userProfileSelectors } from "../../features/admin/adminSlice";

export default function useUserProfiles() {
    const userProfileLists = useAppSelector(userProfileSelectors.selectAll);
    const {userloaded, metaData} = useAppSelector(state => state.admin);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!userloaded) dispatch(getUsersAdmin());
    }, [userloaded, dispatch])

    return {
        userProfileLists, userloaded, metaData
    }
}

