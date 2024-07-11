import { Link } from "react-router-dom";
import { useUserContext } from "../../Hooks/useUserContext";
import Loader from "../Loader";

const AuthButtons = () => {
  const { isLoggedIn, ready, logout } = useUserContext();

  return (
    <div className="flex items-center space-x-4">
      {ready ? (
        isLoggedIn() ? (
          <button
            onClick={async () => await logout()}
            className="border border-black font-semibold hover:bg-gray-300 py-2 px-4"
          >
            Logout
          </button>
        ) : (
          <div className="flex space-x-3">
            <Link to="/login">
              <button className="border border-black font-semibold hover:bg-gray-300 py-2 px-4">
                Login
              </button>
            </Link>
            <Link className="hidden sm:block" to="/register">
              <button className="py-2 px-4 bg-gray-900 font-semibold text-gray-100 hover:bg-gray-800">
                Register
              </button>
            </Link>
          </div>
        )
      ) : (
        <Loader type="circle" size={30} />
      )}
    </div>
  );
};

export default AuthButtons;
