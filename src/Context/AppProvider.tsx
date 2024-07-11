import { Provider } from "react-redux";
import RouterProvider from "./RouterProvider";
import store from "../Store/store";
import { UserContextProvider } from "./UserProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import config from "../Config";

function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <UserContextProvider>
          <RouterProvider>{children}</RouterProvider>
        </UserContextProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default AppProvider;
