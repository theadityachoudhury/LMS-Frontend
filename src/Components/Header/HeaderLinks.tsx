import { navLinks } from "../../Utils/NavLinks";
import { Link, useLocation } from "react-router-dom";

const HeaderLinks = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex space-x-4">
      {navLinks.map((link, index) => (
        <Link
          key={index}
          to={link.link}
          className={`${pathname == link.link ? "text-indigo-700" : "text-white"} hover:text-indigo-500 py-2`}
        >
          {link.title}
        </Link>
      ))}
    </div>
  );
};

export default HeaderLinks;
