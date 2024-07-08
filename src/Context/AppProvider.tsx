import { Provider } from "react-redux";
import RouterProvider from "./RouterProvider";
import store from "../Store/store";
import { UserContextProvider } from "./UserProvider";

function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <UserContextProvider>
        <RouterProvider>{children}</RouterProvider>
      </UserContextProvider>
    </Provider>
  );
}

export default AppProvider;
