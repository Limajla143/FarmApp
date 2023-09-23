import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { AgriType, AgriTypeParams } from "../../app/models/agriType";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configStore";
import { MetaData } from "../../app/models/pagination";

interface AgriTypeState {
    agritype: AgriType | null;
    agriloaded: boolean;
    agristatus: string;
    agrTypeParams: AgriTypeParams;
    metaData: MetaData | null;
}

const agriTypeAdapter = createEntityAdapter<AgriType>({
    selectId: (agriType) => agriType.agriTypeId
});
function getAgrTypeParams(agrTypeParams: AgriTypeParams) {
   const params = new URLSearchParams();
   
   params.append('pageNumber', agrTypeParams.pageNumber.toString());
   params.append('pageSize', agrTypeParams.pageSize.toString());
   params.append('orderBy', agrTypeParams.orderBy);

   if(agrTypeParams.search) params.append('search', agrTypeParams.search);

   return params;
}

export const getAgriTypes = createAsyncThunk<AgriType[], void, {state: RootState}>(
    'agriType/getAgriTypes',
    async(_, thunkAPI) => {
        const params = getAgrTypeParams(thunkAPI.getState().agritype.agrTypeParams);
        try {
            const response = await agent.AgriTypes.agriTypes(params);
            thunkAPI.dispatch(setMetaData(response.metaData));
            return response.items;
        }catch(error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const getAgriType = createAsyncThunk<AgriType, number>(
    'agriType/getAgriType',
    async (id, thunkAPI) => {
        try {
            const agrType = await agent.AgriTypes.agriType(id);
            return agrType;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

function initParams() {
    return {
        pageNumber: 1,
        pageSize: 5,
        orderBy: 'nameAsc'
    }
}

export const agriTypeSlice = createSlice({
    name: 'agriType',
    initialState: agriTypeAdapter.getInitialState<AgriTypeState>({
        agritype: null,
        agriloaded: false,
        agristatus: 'idle',
        agrTypeParams: initParams(),
        metaData: null
    }),
    reducers: {
        setAgriType: (state, action) => {
           agriTypeAdapter.upsertOne(state, action.payload);
        },
        removeAgriType: (state, action) => {
            agriTypeAdapter.removeOne(state, action.payload)
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload
        },
        resetAgrParams: (state, action) => {
            state.agrTypeParams = initParams()
        },
        setPageNumber: (state, action) => {
            state.agriloaded = false;
            state.agrTypeParams = {...state.agrTypeParams, ...action.payload };
        },
        setAgriTypeParams: (state, action) => {
            state.agriloaded = false;
            state.agrTypeParams = {...state.agrTypeParams, ...action.payload, pageNumber: 1};
        }
    },
    extraReducers: (buider => {
        buider.addCase(getAgriTypes.pending, (state) => {
            state.agristatus = 'pending';
        });
        buider.addCase(getAgriTypes.fulfilled, (state, action) => {
            agriTypeAdapter.setAll(state, action.payload);
            state.agristatus = 'idle';
            state.agriloaded = true;           
        });
        buider.addCase(getAgriTypes.rejected, (state) => {
            state.agristatus = 'idle';
        });
        buider.addCase(getAgriType.pending, (state) => {
            state.agristatus = 'pending';
        });
        buider.addCase(getAgriType.fulfilled, (state, action) => {
            agriTypeAdapter.upsertOne(state, action.payload);
            state.agristatus = 'idle';
        });
        buider.addCase(getAgriType.rejected, (state) => {
            state.agristatus = 'idle';
        });
    })
})

export const agriTypeSelectors = agriTypeAdapter.getSelectors((state: RootState) => state.agritype);
export const {setAgriType, removeAgriType, setMetaData, resetAgrParams, setPageNumber, setAgriTypeParams} = agriTypeSlice.actions;