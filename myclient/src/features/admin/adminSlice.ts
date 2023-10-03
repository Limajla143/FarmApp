import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configStore";
import { MetaData } from "../../app/models/pagination";
import { UserProfile, UserProfileParams } from "../../app/models/UserProfile";

interface UserProfileState {
    userProfile: UserProfile | null;
    userloaded: boolean;
    userstatus: string;
    userProfileParams: UserProfileParams;
    metaData: MetaData | null;
}

const userProfileTypeAdapter = createEntityAdapter<UserProfile>();

function getUserProfileParams(userProfileParams: UserProfileParams) {
   const params = new URLSearchParams();
   
   params.append('pageNumber', userProfileParams.pageNumber.toString());
   params.append('pageSize', userProfileParams.pageSize.toString());

   if(userProfileParams.search) params.append('searchUser', userProfileParams.search);

   return params;
}

export const getUsersAdmin = createAsyncThunk<UserProfile[], void, {state: RootState}>(
    'admin/getUsers',
    async(_, thunkAPI) => {
        const params = getUserProfileParams(thunkAPI.getState().admin.userProfileParams);
        try {
            const response = await agent.Admin.getUsersForAdmin(params);
            thunkAPI.dispatch(setMetaDataUsers(response.metaData));
            return response.items;
        }catch(error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const getUserAdmin = createAsyncThunk<UserProfile, number>(
    'admin/getUserAdmin',
    async (id, thunkAPI) => {
        try {
            const user = await agent.Admin.getUserForAdmin(id);
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

function initParams() {
    return {
        pageNumber: 1,
        pageSize: 5,
    }
}

export const adminSlice = createSlice({
    name: 'admin',
    initialState: userProfileTypeAdapter.getInitialState<UserProfileState>({
        userProfile: null,
        userloaded: false,
        userstatus: 'idle',
        userProfileParams: initParams(),
        metaData: null
    }),
    reducers: {
        setUserProfile: (state, action) => {
           userProfileTypeAdapter.upsertOne(state, action.payload);
        },
        setMetaDataUsers: (state, action) => {
            state.metaData = action.payload
        },
        resetUserParams: (state, action) => {
            state.userProfileParams = initParams()
        },
        setUsersPageNumber: (state, action) => {
            state.userloaded = false;
            state.userProfileParams = {...state.userProfileParams, ...action.payload };
        },
        setUserProfileParams: (state, action) => {
            state.userloaded = false;
            state.userProfileParams = {...state.userProfileParams, ...action.payload, pageNumber: 1};
        }
    },
    extraReducers: (buider => {
        buider.addCase(getUsersAdmin.pending, (state) => {
            state.userstatus = 'pending';
        });
        buider.addCase(getUsersAdmin.fulfilled, (state, action) => {
            userProfileTypeAdapter.setAll(state, action.payload);
            state.userstatus = 'idle';
            state.userloaded = true;           
        });
        buider.addCase(getUsersAdmin.rejected, (state) => {
            state.userstatus = 'idle';
        });
        buider.addCase(getUserAdmin.pending, (state) => {
            state.userstatus = 'pending';
        });
        buider.addCase(getUserAdmin.fulfilled, (state, action) => {
            userProfileTypeAdapter.upsertOne(state, action.payload);
            state.userstatus = 'idle';
        });
        buider.addCase(getUserAdmin.rejected, (state) => {
            state.userstatus = 'idle';
        });
    })
})

export const userProfileSelectors = userProfileTypeAdapter.getSelectors((state: RootState) => state.admin);
export const {setUserProfile,  setMetaDataUsers, resetUserParams, setUsersPageNumber, setUserProfileParams} = adminSlice.actions;