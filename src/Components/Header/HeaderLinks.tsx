import { navLinks } from "../../Utils/NavLinks";
import { Link } from "react-router-dom";

const HeaderLinks = () => {
  return (
    <div className="space-x-4 m-2">
      {navLinks.map((link, index) => {
        return (
          //highlight when selected
          <Link
            key={index}
            to={link.link}
            className="text-black hover:text-indigo-500 py-2"
          >
            {link.title}
          </Link>
        );
      })}
    </div>
  );
};

export default HeaderLinks;
