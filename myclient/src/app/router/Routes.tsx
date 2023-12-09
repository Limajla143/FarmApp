import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Register from "../../features/account/Register";
import Login from "../../features/account/Login";
import RequireAuth from "./RequireAuth";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import AgriTypeLists from "../../features/moderator/agriTypes/AgriTypeLists";
import UserProfileLists from "../../features/admin/users/UserProfileLists";
import ProductInventory from "../../features/moderator/products/ProductInventory";
import ProductCatalog from "../../features/productUsers/ProductCatalog";
import ProductUserDetail from "../../features/productUsers/ProductUserDetail";
import BasketPage from "../../features/basket/BasketPage";
import Orders from "../../features/order/Orders";
import CheckoutWrapper from "../../features/checkOut/CheckoutWrapper";
import ErrorPage from "../../features/testerrors/ErrorPage";
import Contact from "../../features/home/Contact";
import About from "../../features/home/About";
import ConfirmEmail from "../../features/account/ConfirmEmail";
import ForgotPassword from "../../features/account/ForgotPassword";
import ResetPassword from "../../features/account/ResetPassword";
import UserForm from "../../features/account/UserForm";

export const router = createBrowserRouter([
    {
        path: '/', element: <App />,
        children: [
            {path: 'login', element: <Login />},
            {path: 'register', element: <Register />},
            {path: 'contacts', element: <Contact />},
            {path: 'about', element: <About />},
            {path: 'confirmemail', element: <ConfirmEmail />},
            {path: 'successconfirmemail/:userId/:token', element: <ConfirmEmail />},
            {path: 'forgotpassword', element: <ForgotPassword /> },
            {path: 'resetpassword/:email/:token', element: <ResetPassword /> },
            {element: <RequireAuth />, children: [
                {path: 'products', element: <ProductCatalog />},
                {path: 'products/:id', element: <ProductUserDetail />},
                {path: 'basket', element: <BasketPage />},
                {path: 'orders', element: <Orders /> },
                {path: 'checkout', element: <CheckoutWrapper />},
                {path: 'getUser/:email', element: <UserForm /> }
            ]},
            // for moderator and admin only
            {element: <RequireAuth role={['Admin', 'Moderator']}/>, children: [
                {path: 'inventory', element: <ProductInventory />},
                {path: 'agritypes', element: <AgriTypeLists />}
            ]},           
            // for admin only
            {element: <RequireAuth role={['Admin']}/>, children: [
                {path: 'users', element: <UserProfileLists />},

            ]},
            {path: 'testerrors', element: <ErrorPage />},
            {path: 'server-error', element: <ServerError /> },
            {path: 'not-found', element: <NotFound /> },
            {path: '*', element: <Navigate replace to='/not-found' />}
        ]
    }
])