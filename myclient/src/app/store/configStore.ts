import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { accountSlice } from "../../features/account/accountSlice";
import { agriTypeSlice } from "../../features/moderator/agriTypes/agriTypeSlice";
import { adminSlice } from "../../features/admin/users/adminSlice";
import { productSlice } from "../../features/moderator/products/productSlice";



export const store = configureStore({
    reducer: {
        account: accountSlice.reducer,
        agritype: agriTypeSlice.reducer,
        admin: adminSlice.reducer,
        product: productSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector : TypedUseSelectorHook<RootState> = useSelector;