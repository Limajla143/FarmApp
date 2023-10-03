import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Register from "../../features/account/Register";
import Login from "../../features/account/Login";
import RequireAuth from "./RequireAuth";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import AgriTypeLists from "../../features/agriTypes/AgriTypeLists";
import UserProfileLists from "../../features/admin/UserProfileLists";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {path: '/', element: <HomePage /> },
            {path: 'login', element: <Login />},
            {path: 'register', element: <Register />},
            {path: 'agritypes', element: <AgriTypeLists />},
            {path: 'users', element: <UserProfileLists />},
            {path: 'server-error', element: <ServerError /> },
            {path: 'not-found', element: <NotFound /> },
            {path: '*', element: <Navigate replace to='/not-found' />}
        ]
    }
])