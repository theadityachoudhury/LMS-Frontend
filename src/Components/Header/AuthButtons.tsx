import { Link } from "react-router-dom";
import { useUserContext } from "../../Hooks/useUserContext";
import Loader from "../Loader";

const AuthButtons = () => {
  const { isLoggedIn, ready, logout } = useUserContext();

  return (
    <div>
      {ready ? (
        isLoggedIn() ? (
          <div>
            <button
              onClick={async () => await logout()}
              className="border border-black font-semibold hover:bg-gray-300 py-2 px-4"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-x-3">
            <Link to="/login">
              <button className="border border-black font-semibold hover:bg-gray-300 py-2 px-4">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="py-2 px-4 bg-gray-900 font-semibold text-gray-100 hover:bg-gray-800">
                Register
              </button>
            </Link>
          </div>
        )
      ) : (
        <div className="mt-2">
          <Loader type="circle" size={30} />
        </div>
      )}
    </div>
  );
};

export default AuthButtons;
