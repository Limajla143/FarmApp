import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { MetaData } from "../../app/models/pagination";
import { Order, OrderParams } from "../../app/models/order";
import { RootState } from "../../app/store/configStore";
import agent from "../../app/api/agent";

interface OrderState {
    ordersLoaded: boolean;
    status: string;
    orderParams: OrderParams;
    metaData: MetaData | null;
}

const ordersAdapter = createEntityAdapter<Order>();

function getOrderParams(orderParams: OrderParams) {
    const params = new URLSearchParams();
    params.append('pageNumber', orderParams.pageNumber.toString());
    params.append('pageSize', orderParams.pageSize.toString());

    if(orderParams.dateFrom) params.append('dateFrom', orderParams.dateFrom);
    if(orderParams.dateTo) params.append('dateTo', orderParams.dateTo);

    return params;
}

export const getOrdersAsync = createAsyncThunk<Order[], void, {state: RootState}>(
    'order/getOrdersAsync',
    async(_, thunkAPI) => {
        const params = getOrderParams(thunkAPI.getState().order.orderParams);
        try {
            const response = await agent.Orders.getOrders(params);
            thunkAPI.dispatch(setMetaData(response.metaData));
            return response.items;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const getOrderAsync = createAsyncThunk<Order, number>(
    'order/getOrderAsync',
    async(id, thunkAPI) => {
        try {
            return await agent.Orders.getOrder(id);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

function initParams() {
    return {
        pageNumber: 1,
        pageSize: 6,
        sort: 'name',
        types: []
    }
}

export const orderSlice = createSlice({
    name: 'order',
    initialState: ordersAdapter.getInitialState<OrderState>({
        ordersLoaded: false,
        status: 'idle',
        orderParams: initParams(),
        metaData: null
    }),
    reducers: {
      setOrderParams: (state, action) => {
        state.ordersLoaded = false;
        state.orderParams = {...state.orderParams, ...action.payload, pageNumber: 1};
      },
      setPageNumber: (state, action) => {
        state.ordersLoaded = false;
        state.orderParams = {...state.orderParams, ...action.payload};
      },
      setMetaData: (state, action) => {
        state.metaData = action.payload;
      },
      resetOrderParams: (state) => {
        state.orderParams = initParams();
      },
      setOrder: (state, action) => {
        ordersAdapter.upsertOne(state, action.payload);
      },
      removeOrder: (state, action) => {
        ordersAdapter.removeOne(state, action.payload)
      }
    },
    extraReducers: (builder => {
        builder.addCase(getOrdersAsync.pending, (state) => {
            state.status = 'pendingGetOrders'
        });

        builder.addCase(getOrdersAsync.fulfilled, (state, action) => {
            ordersAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.ordersLoaded = true;
        });

        builder.addCase(getOrdersAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });

        builder.addCase(getOrderAsync.pending, (state) => {
            state.status = 'pendingGetOrder';
        });
        builder.addCase(getOrderAsync.fulfilled, (state, action) => {
            ordersAdapter.upsertOne(state, action.payload);
            state.status = 'idle';
        });
        builder.addCase(getOrderAsync.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action);
        });
    })
})

export const ordersSelectors = ordersAdapter.getSelectors((state: RootState) => state.order);
export const {setOrderParams, resetOrderParams, setMetaData, setPageNumber, setOrder, removeOrder} = orderSlice.actions;