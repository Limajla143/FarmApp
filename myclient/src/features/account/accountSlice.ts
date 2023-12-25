import { PayloadAction, createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { router } from "../../app/router/Routes";
import { toast } from "react-toastify";
import { User } from "../../app/models/User";
import { setBasket } from "../basket/basketSlice";
import { minToMilliSecond } from "../../app/utility/utils";

interface AccountState {
    user: User | null;
    refreshTokenTimeout: NodeJS.Timeout | null;
    showTimerDialog: boolean;
    showIdleDialog: boolean;
}

const initialState: AccountState = {
    user: null,
    refreshTokenTimeout: null,
    showTimerDialog: false,
    showIdleDialog: false
}

export const signInUser = createAsyncThunk<User, FieldValues>(
    'account/signInUser',
    async (data, thunkAPI) => {
        try {
            const userDto = await agent.Account.login(data);
            const {basket, ...user} = userDto;
            if(basket) thunkAPI.dispatch(setBasket(basket));
            localStorage.setItem('user', JSON.stringify(user));

            startRefreshTokenTimer(user, thunkAPI);          
            return user;
        } catch (error: any) {
            console.log('Error login ', error);
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }  
)

export const fetchCurrentUser = createAsyncThunk<User>(
    'account/fetchCurrentUser',
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));
        try {
            const userDto = await agent.Account.currentUser();
            const {basket, ...user} = userDto;
            if(basket) thunkAPI.dispatch(setBasket(basket));

            startRefreshTokenTimer(user, thunkAPI);

            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    },
    {
        condition: () => {
            return !!localStorage.getItem('user');
        }
    }
)

export const refreshToken = createAsyncThunk<User>(
    'account/refreshToken',
     async (_, thunkAPI) => {
        try {
            stopRefreshTokenTimer(thunkAPI);
			const userDto = await agent.Account.refreshToken();
            const {basket, ...user} = userDto;
            if (user) thunkAPI.dispatch(setUser(user));
            if(basket) thunkAPI.dispatch(setBasket(basket));
            localStorage.setItem("user", JSON.stringify(user));
            startRefreshTokenTimer(user, thunkAPI);
            return user;
        } catch (error: any) {
            toast.error(error);
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }  
)

const startRefreshTokenTimer = (user: User, thunkAPI: any) => {
    const jwtToken = JSON.parse(atob(user.token.split(".")[1]));
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 30 * 1000;
    let countdown = Math.ceil(timeout / 1000);
    console.log(countdown);
    const countdownInterval = setInterval(() => {
        countdown -= 1;
      }, 1000);
  
    thunkAPI.dispatch(setRefreshTokenTimeout(setTimeout(() => {
        clearInterval(countdownInterval); 
        thunkAPI.dispatch(setShowTimerDialog(true));
    }, timeout)));
  };
  
  const stopRefreshTokenTimer = (thunkAPI: any) => {
    const timeout = thunkAPI.getState().account.refreshTokenTimeout;
    if (timeout) {
        clearTimeout(timeout);
        thunkAPI.dispatch(setRefreshTokenTimeout(null));
        console.log(timeout);
    }
  };


export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        signOut: (state) => {
            state.user = null;
            state.refreshTokenTimeout = null;
            localStorage.removeItem('user');
            router.navigate('/');
        },
        setUser: (state, action: PayloadAction<User>) => {
            let claims = JSON.parse(atob(action.payload.token.split('.')[1])); 
            let role = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            state.user = {...action.payload, role: typeof(role) === 'string' ? [role] : role}; 
        },
        setRefreshTokenTimeout: (state, action: PayloadAction<NodeJS.Timeout | null>) => {
            state.refreshTokenTimeout = action.payload;
        },
        setShowTimerDialog: (state, action: PayloadAction<boolean>) => {
            console.log('Set ShowTimer');
            state.showTimerDialog = action.payload;
        },
        setIdleDialog: (state, action: PayloadAction<boolean>) => {
            console.log('Set IDle TIMER');
            state.showIdleDialog = action.payload;
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchCurrentUser.rejected, (state) => {
            state.user = null;
            localStorage.removeItem('user');
            toast.error('Session expired - please login again');
            router.navigate('/');
        });
        builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
            let claims = JSON.parse(atob(action.payload.token.split('.')[1])); 
            let role = claims['role'];
            state.user = {...action.payload, role: typeof(role) === 'string' ? [role] : role}; 
        });
        builder.addMatcher(isAnyOf(signInUser.rejected), (state, action) => {
            throw action.payload;
        });
    })
})

export const {signOut, setUser, setRefreshTokenTimeout, setShowTimerDialog, setIdleDialog} = accountSlice.actions;