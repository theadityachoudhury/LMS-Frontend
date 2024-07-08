// src/store/slices/userSlice.ts

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { BackendTokens, User, UserState } from "../../Types";
import instance from "../../Axios";

const initialState: UserState = {
  user: null,
  authenticated: Cookies.get("authenticated") === "true" || false,
  ready: false,
  error: null,
};

export const fetchUser = createAsyncThunk<User, void, { rejectValue: string }>(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await instance.get("/api/auth/user");
      return data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch user data");
    }
  },
);

export const refreshAccessToken = createAsyncThunk<
  BackendTokens,
  void,
  { rejectValue: string }
>("user/refreshAccessToken", async (_, { rejectWithValue }) => {
  try {
    const { data } = await instance.get("/api/auth/refresh");
    Cookies.set("accessToken", data.data.token, {
      secure: true,
      sameSite: "Strict",
      expires: new Date(Date.now() + data.data.expiresIn * 1000),
    });
    Cookies.set("authenticated", "true", { expires: 7 });
    return data.data;
  } catch (error) {
    return rejectWithValue("Failed to refresh access token");
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
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    login: (state, action: PayloadAction<BackendTokens>) => {
      state.user = action.payload.user;
      state.authenticated = true;
      Cookies.set("accessToken", action.payload.token, {
        secure: true,
        sameSite: "Strict",
        expires: new Date(Date.now() + action.payload.expiresIn * 1000),
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
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.ready = true;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.user = null;
        state.authenticated = false;
        state.ready = true;
        state.error = action.payload || "Failed to fetch user data";
      })
      .addCase(
        refreshAccessToken.fulfilled,
        (state, action: PayloadAction<BackendTokens>) => {
          state.user = action.payload.user;
          state.ready = true;
          state.error = null;
        },
      )
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.user = null;
        state.authenticated = false;
        state.ready = true;
        state.error = action.payload || "Failed to refresh access token";
      });
  },
});

export const { setUser, setReady, setError, login, logout, verify } =
  userSlice.actions;
export default userSlice.reducer;
