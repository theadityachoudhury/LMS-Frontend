import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserContext } from "../Hooks/useUserContext";
import Loader from "./Loader";

const ProtectedRoute = () => {
  const { authenticated, isLoggedIn, user, ready, logout } = useUserContext();
  const { pathname, search } = useLocation();
  if (!authenticated && !isLoggedIn) {
    return (
      <Navigate
        to={`/login?callback=${search ? search.split("=")[1] : pathname}`}
      />
    );
  } else {
    if (!ready) {
      return <Loader size={48} fullScreen={true} />;
    }
    if (ready && !user) {
      logout();
      return (
        <Navigate
          to={`/login?callback=${search ? search.split("=")[1] : pathname}`}
        />
      );
    }

    if (ready && user && !user.verified) {
      if (window.location.pathname != "/verify")
        return <Navigate to={`/verify?callback=${pathname}`} />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
