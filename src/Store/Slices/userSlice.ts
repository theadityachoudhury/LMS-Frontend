import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { BackendTokens, User, UserState, loginError } from "../../Types";
import instance from "../../Axios";

const initialState: UserState = {
  user: null,
  authenticated: Cookies.get("authenticated") === "true" || false,
  ready: false,
  error: {
    recognition: null,
    password: null,
    account: null,
  },
};

const initialError: loginError = {
  recognition: null,
  password: null,
  account: null,
};

export const loginUser = createAsyncThunk<
  BackendTokens,
  { recognition: { email?: string; username?: string }; password: string },
  { rejectValue: loginError }
>("user/login", async (loginData, { rejectWithValue }) => {
  try {
    const { data } = await instance.post("/api/auth/login", loginData);
    if (data.status === 200) {
      return data.data;
    } else {
      if (data.status === 403 || data.status === 400 || data.status === 500) {
        return rejectWithValue({ ...initialError, account: data.message });
      } else if (data.status === 401) {
        return rejectWithValue({ ...initialError, password: data.message });
      } else if (data.status === 404) {
        return rejectWithValue({ ...initialError, recognition: data.message });
      }
    }
  } catch (error) {
    return rejectWithValue({ ...initialError, account: "Failed to login" });
  }
});

export const fetchUser = createAsyncThunk<
  User,
  void,
  { rejectValue: loginError }
>("user/fetchUser", async (_, { rejectWithValue }) => {
  try {
    const { data } = await instance.get("/api/auth/user");
    if (data.status === 200) {
      return data.data;
    } else {
      return rejectWithValue({ ...initialError, account: data.message });
    }
  } catch (error) {
    return rejectWithValue({
      ...initialError,
      account: "Failed to fetch user",
    });
  }
});

export const refreshAccessToken = createAsyncThunk<
  BackendTokens,
  void,
  { rejectValue: loginError }
>("user/refreshAccessToken", async (_, { rejectWithValue }) => {
  try {
    const { data } = await instance.post("/api/auth/refresh");
    if (data.status === 200) {
      return data.data;
    } else {
      return rejectWithValue({ ...initialError, account: data.message });
    }
  } catch (error) {
    return rejectWithValue({
      ...initialError,
      account: "Failed to refresh token",
    });
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: loginError }
>("user/logout", async (_, { rejectWithValue }) => {
  try {
    const { data } = await instance.post("/api/auth/logout");
    if (data.status === 200) {
      return;
    } else {
      return rejectWithValue({ ...initialError, account: data.message });
    }
  } catch (error) {
    return rejectWithValue({ ...initialError, account: "Failed to logout" });
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setReady: (state, action: PayloadAction<boolean>) => {
      state.ready = action.payload;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.authenticated = action.payload;
    },
    setError: (state, action: PayloadAction<loginError>) => {
      state.error = action.payload;
    },
    login: (state, action: PayloadAction<BackendTokens>) => {
      state.user = action.payload.user;
      state.authenticated = true;
      Cookies.set("accessToken", action.payload.accessToken, {
        secure: true,
        sameSite: "Strict",
        expires: new Date(Date.now() + action.payload.expiresIn),
      });
      Cookies.set("refreshAccessToken", action.payload.refreshToken);
      Cookies.set("authenticated", "true", { expires: 7 });
    },
    logout: (state) => {
      state.user = null;
      state.authenticated = false;
      Cookies.remove("token");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.set("authenticated", "false");
      Cookies.remove("refreshAccessToken");
    },
    verify: (state) => {
      if (state.user) {
        state.user.verified = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<BackendTokens>) => {
          // Handle login success using login reducer
          console.log("loginUser.fulfilled");
          userSlice.caseReducers.login(state, action);
          state.error = initialError;
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        // Handle login failure using setError reducer
        userSlice.caseReducers.setError(state, {
          payload: action.payload || {
            ...initialError,
            account: "Failed to login",
          },
          type: "user/setError",
        });
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        // Handle fetch user success using setUser and setReady reducers
        userSlice.caseReducers.setUser(state, action);
        userSlice.caseReducers.setReady(state, {
          payload: true,
          type: "user/setReady",
        });
        state.error = initialError;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        // Handle fetch user failure using setUser and setError reducers
        userSlice.caseReducers.setUser(state, {
          payload: null,
          type: "user/setUser",
        });
        userSlice.caseReducers.setError(state, {
          payload: action.payload || {
            ...initialError,
            account: "Failed to fetch user",
          },
          type: "user/setError",
        });
      })
      .addCase(refreshAccessToken.fulfilled, (state) => {
        // Handle refresh token success using login reducer
        //call fetchUser to get the updated user
        userSlice.caseReducers.setAuthenticated(state, {
          payload: true,
          type: "user/setAuthenticated",
        });
        userSlice.caseReducers.setReady(state, {
          payload: true,
          type: "user/setReady",
        });
        state.error = initialError;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        // Handle refresh token failure using logout and setError reducers
        userSlice.caseReducers.logout(state);
        userSlice.caseReducers.setReady(state, {
          payload: true,
          type: "user/setReady",
        });
        userSlice.caseReducers.setError(state, {
          payload: action.payload || {
            ...initialError,
            account: "Failed to refresh token",
          },
          type: "user/setError",
        });
      })
      .addCase(logoutUser.fulfilled, (state) => {
        // Handle logout success using logout reducer
        userSlice.caseReducers.logout(state);
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // Handle logout failure using setError reducer
        userSlice.caseReducers.setError(state, {
          payload: action.payload || {
            ...initialError,
            account: "Failed to logout",
          },
          type: "user/setError",
        });
      });
  },
});

export const {
  setUser,
  setReady,
  setError,
  login,
  logout,
  verify,
  setAuthenticated,
} = userSlice.actions;
export default userSlice.reducer;
