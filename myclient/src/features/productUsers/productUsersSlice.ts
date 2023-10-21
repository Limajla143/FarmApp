import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { MetaData } from "../../app/models/pagination";
import { ProductUsers, ProductUsersParams } from "../../app/models/productUsers";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configStore";

interface ProductUsersState {
    productUsersLoaded: boolean;
    filterUsersLoaded: boolean;
    status: string;
    types: string[];
    productUsersParams: ProductUsersParams;
    metaData: MetaData | null;
}

const productUsersAdapter = createEntityAdapter<ProductUsers>();

function getAxiosParams(productParams: ProductUsersParams) {
    const params = new URLSearchParams();
    params.append('pageNumber', productParams.pageNumber.toString());
    params.append('pageSize', productParams.pageSize.toString());
    params.append('orderBy', productParams.sort);
    
    if (productParams.search) params.append('search', productParams.search);
    if (productParams.types.length > 0) params.append('types', productParams.types.toString());

    return params;
}

export const fetchProductUsersAsync = createAsyncThunk<ProductUsers[], void, {state: RootState}>(
    'productUsers/fetchProductUsersAsync',
    async(_, thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().productUsers.productUsersParams);
        try {
            const response = await agent.ProductForUsers.products(params);
            thunkAPI.dispatch(setMetaData(response.metaData));
            return response.items;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const fetchProductUserAsync = createAsyncThunk<ProductUsers, number>(
    'productUsers/fetchProductUserAsync',
    async(productId, thunkAPI) => {
        try {
            return await agent.ProductForUsers.product(productId)
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const fetchFilters = createAsyncThunk(
    'productUsers/fetchFilters',
    async(_, thunkAPI) => {
        try {
            return agent.ProductForUsers.fetchfilters();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
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

export const productUsersSlice = createSlice({
    name: 'productUsers',
    initialState: productUsersAdapter.getInitialState<ProductUsersState>({
        productUsersLoaded: false,
        filterUsersLoaded: false,
        status: 'idle',
        types: [],
        productUsersParams: initParams(),
        metaData: null
    }),
    reducers: {
        setProductUsersParams: (state, action) => {
            state.productUsersLoaded = false;
            state.productUsersParams = {...state.productUsersParams, ...action.payload, pageNumber: 1};
        },
        setPageNumber: (state, action) => {
            state.productUsersLoaded = false;
            state.productUsersParams = {...state.productUsersParams, ...action.payload};
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload
        },
        resetProductParams: (state) => {
            state.productUsersParams = initParams();
        },
        setProduct: (state, action) => {
            productUsersAdapter.upsertOne(state, action.payload);
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchProductUsersAsync.pending, (state) => {
            state.status = 'pendingFetchProductUsers'
        });

        builder.addCase(fetchProductUsersAsync.fulfilled, (state, action) => {
            productUsersAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.productUsersLoaded = true;
        });
        builder.addCase(fetchProductUsersAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });
        builder.addCase(fetchProductUserAsync.pending, (state) => {
            state.status = 'pendingFetchProductUser';
        });
        builder.addCase(fetchProductUserAsync.fulfilled, (state, action) => {
            productUsersAdapter.upsertOne(state, action.payload);
            state.status = 'idle';
        });
        builder.addCase(fetchProductUserAsync.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action);
        });
        builder.addCase(fetchFilters.pending, (state) => {
            state.status = 'pendingFetchFilters';
        });
        builder.addCase(fetchFilters.fulfilled, (state, action) => {
            state.types = action.payload;
            state.filterUsersLoaded = true; 
            state.status = 'idle';
        });
        builder.addCase(fetchFilters.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action.payload);
        });
    })
})

export const productUsersSelectors = productUsersAdapter.getSelectors((state: RootState) => state.productUsers);
export const {setProductUsersParams, resetProductParams, setMetaData, setProduct, setPageNumber} = productUsersSlice.actions;
