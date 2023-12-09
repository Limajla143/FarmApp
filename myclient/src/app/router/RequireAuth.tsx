import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/configStore";
import { toast } from "react-toastify";

interface Props {
    role?: string[];
}

export default function RequireAuth({role}: Props) {
    const {user} = useAppSelector(state => state.account);
    const location = useLocation();

    if (!user) {
        return <Navigate to='/login' state={{from: location}} />
    }

    if(user.statusId == 5) {
        return <Navigate to={`/getUser/${user.email}`} />
    }

    if(role && !role.some(r => user.role?.includes(r))) {
        toast.error('Not authorized to access this.');
        return <Navigate to='/' />
    }

    return <Outlet />
}