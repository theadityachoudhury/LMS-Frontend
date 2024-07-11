import { Logs, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import config from "../../Config";

const MobileMenu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div>
      <button onClick={toggleMobileMenu} className="text-black p-2 rounded">
        {isMobileMenuOpen ? <X size={35} /> : <Logs size={35} />}
      </button>

      <div
        ref={menuRef}
        className={`fixed top-0 left-0 w-3/4 h-full bg-white shadow-lg z-40 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <span className="text-3xl font-bold hover:text-indigo-500">
            {config.APP_NAME}
          </span>
          <button className="rounded-md" onClick={toggleMobileMenu}>
            <X size={24} className="text-slate-700 hover:text-black" />
          </button>
        </div>
        <div className="p-4">
          <ul className="space-y-4 text-gray-700">
            <li>
              <a href="/login" className="hover:text-indigo-500">
                Log in
              </a>
            </li>
            <li>
              <a href="/register" className="hover:text-indigo-500">
                Sign up
              </a>
            </li>
            <li>
              <a href="/pricing" className="hover:text-indigo-500">
                Plans & Pricing
              </a>
            </li>
            <li className="mt-4 font-bold text-gray-900">Most popular</li>
            <li>
              <a
                href="/topic/web-development"
                className="hover:text-indigo-500"
              >
                Web Development
              </a>
            </li>
            <li>
              <a
                href="/topic/mobile-development"
                className="hover:text-indigo-500"
              >
                Mobile Development
              </a>
            </li>
            <li>
              <a
                href="/topic/game-development"
                className="hover:text-indigo-500"
              >
                Game Development
              </a>
            </li>
            <li>
              <a
                href="/topic/entrepreneurship"
                className="hover:text-indigo-500"
              >
                Entrepreneurship
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
