import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/configStore";
import { fetchRoles, getUsersAdmin, userProfileSelectors } from "../../features/admin/adminSlice";

export default function useUserProfiles() {
    const userProfileLists = useAppSelector(userProfileSelectors.selectAll);
    const {userloaded, metaData, roles, rolesloaded} = useAppSelector(state => state.admin);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!userloaded) dispatch(getUsersAdmin());
    }, [userloaded, dispatch])

    useEffect(() => {
        if(!rolesloaded) dispatch(fetchRoles());
    }, [rolesloaded, dispatch])

    return {
        userProfileLists, userloaded, metaData, roles
    }
}

