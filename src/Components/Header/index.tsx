import { Link } from "react-router-dom";
import config from "../../Config";
import AuthButtons from "./AuthButtons";
import HeaderLinks from "./HeaderLinks";

const Header = () => {
  return (
    <header className="text-xl m-3">
      <div className="flex justify-around">
        <div>
          <Link to="/">
            <h1 className="text-3xl font-bold hover:text-indigo-500">
              {config.APP_NAME}
            </h1>
          </Link>
        </div>
        <HeaderLinks />
        <AuthButtons />
      </div>
    </header>
  );
};

export default Header;
