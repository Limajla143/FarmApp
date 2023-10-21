import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { MetaData } from "../../../app/models/pagination";
import { Product, ProductParams } from "../../../app/models/product";
import { RootState } from "../../../app/store/configStore";
import agent from "../../../app/api/agent";

interface ProductState {
    productsLoaded: boolean;
    filterLoaded: boolean;
    status: string;
    agritypes: string[];
    productParams: ProductParams;
    metaData: MetaData | null;
}

const productsAdapter = createEntityAdapter<Product>();

function getProductParams(productParams: ProductParams) {
    const params = new URLSearchParams();
    params.append('pageNumber', productParams.pageNumber.toString());
    params.append('pageSize', productParams.pageSize.toString());
    params.append('sort', productParams.sort);
    
    if (productParams.search) params.append('search', productParams.search);
    if (productParams.types.length > 0) params.append('types', productParams.types.toString());

    return params;
}

export const getProductsAsync = createAsyncThunk<Product[], void, {state: RootState}>(
    'product/getProductsAsync',
    async(_, thunkAPI) => {
        const params = getProductParams(thunkAPI.getState().product.productParams);
        try {
            const response = await agent.Products.products(params);
            thunkAPI.dispatch(setMetaData(response.metaData));
            return response.items;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const getProductAsync = createAsyncThunk<Product, number>(
    'catalog/getProductAsync',
    async(productId, thunkAPI) => {
        try {
            return await agent.Products.product(productId)
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const fetchFilters = createAsyncThunk(
    'catalog/fetchFilters',
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

export const productSlice = createSlice({
    name: 'product',
    initialState: productsAdapter.getInitialState<ProductState>({
        productsLoaded: false,
        filterLoaded: false,
        status: 'idle',
        agritypes: [],
        productParams: initParams(),
        metaData: null
    }),
    reducers: {
        setProductParams: (state, action) => {
            state.productsLoaded = false;
            state.productParams = {...state.productParams, ...action.payload, pageNumber: 1};
        },
        setPageNumber: (state, action) => {
            state.productsLoaded = false;
            state.productParams = {...state.productParams, ...action.payload};
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload
        },
        resetProductParams: (state) => {
            state.productParams = initParams();
        },
        setProduct: (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
        },
        removeProduct: (state, action) => {
            productsAdapter.removeOne(state, action.payload)
        }
    },
    extraReducers: (builder => {
        builder.addCase(getProductsAsync.pending, (state) => {
            state.status = 'pendingGetProducts'
        });

        builder.addCase(getProductsAsync.fulfilled, (state, action) => {
            productsAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.productsLoaded = true;
        });

        builder.addCase(getProductsAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });

        builder.addCase(getProductAsync.pending, (state) => {
            state.status = 'pendingGetProduct';
        });
        builder.addCase(getProductAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
            state.status = 'idle';
        });
        builder.addCase(getProductAsync.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action);
        });

        builder.addCase(fetchFilters.pending, (state) => {
            state.status = 'pendingFetchFilters';
        });
        builder.addCase(fetchFilters.fulfilled, (state, action) => {
            state.agritypes = action.payload;
            state.filterLoaded = true; 
            state.status = 'idle';
        });
        builder.addCase(fetchFilters.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action.payload);
        });
    })
})

export const productsSelectors = productsAdapter.getSelectors((state: RootState) => state.product);
export const {setProductParams, resetProductParams, setMetaData, setPageNumber, setProduct, removeProduct} = productSlice.actions;