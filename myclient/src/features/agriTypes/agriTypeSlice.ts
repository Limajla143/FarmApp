import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { AgriType } from "../../app/models/agriType";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configStore";

interface AgriTypeState {
    agritype: AgriType | null;
    agriloaded: boolean;
    agristatus: string;
}


const agriTypeAdapter = createEntityAdapter<AgriType>({
    selectId: (agriType) => agriType.agriTypeId
});

export const getAgriTypes = createAsyncThunk<AgriType[], void, {state: RootState}>(
    'agriType/getAgriTypes',
    async(_, thunkAPI) => {
        try {
            const response = await agent.AgriTypes.agriTypes();
            return response;
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

export const agriTypeSlice = createSlice({
    name: 'agriType',
    initialState: agriTypeAdapter.getInitialState<AgriTypeState>({
        agritype: null,
        agriloaded: false,
        agristatus: 'idle'
    }),
    reducers: {
        setAgriType: (state, action) => {
           agriTypeAdapter.upsertOne(state, action.payload);
        },
        removeAgriType: (state, action) => {
            agriTypeAdapter.removeOne(state, action.payload)
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
export const {setAgriType, removeAgriType} = agriTypeSlice.actions;