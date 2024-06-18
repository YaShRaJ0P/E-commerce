import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { HiUserCircle } from "react-icons/hi";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "@/utils/userStore";

export const Navbar = () => {
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("token");
      console.log(token);

      if (!token) {
        return;
      }

      try {
        const response = await axios.get("http://localhost:5555/auth/check", {
          withCredentials: true,
        });
        console.log(response);

        setUser({ username: response.data.username, userId: response.data.id });
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };

    checkAuth();
  }, [username, dispatch]);

  const handleBlur = () => {
    setTimeout(() => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(document.activeElement)
      ) {
        setDropdown(false);
      }
    }, 100);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogOut = async () => {
    setDropdown(false);
    try {
      await axios.post(
        "http://localhost:5555/auth/logout",
        {},
        { withCredentials: true }
      );
      Cookies.remove("token");
      setUser({ username: "", userId: "" });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="bg-gray-900 text-white shadow-md border-b-2 border-white mb-2">
      <nav className="container mx-auto px-8 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-yellow-500 hover:text-yellow-400"
        >
          Shopease
        </Link>
        <div className="relative">
          <div className="flex flex-row justify-center items-center">
            <span>{username}</span>
            <button
              onClick={() => setDropdown(!dropdown)}
              onBlur={handleBlur}
              className="focus:outline-none"
              aria-expanded={dropdown}
              aria-haspopup="true"
            >
              <HiUserCircle className="text-4xl text-yellow-500 hover:text-yellow-400" />
            </button>
          </div>
          {dropdown && (
            <div
              ref={dropdownRef}
              className="absolute bg-gray-800 rounded-md p-3 flex flex-col -left-20 gap-2 border-slate-700 border-2 mt-2 z-10"
            >
              <Link
                to="/auth"
                onClick={() => setDropdown(false)}
                className="flex items-center gap-2 px-2 py-1 hover:bg-gray-700 rounded"
              >
                <FaUser className="text-yellow-500" />
                <span>Profile</span>
              </Link>
              <Link
                to="/cart"
                onClick={() => setDropdown(false)}
                className="flex items-center gap-2 px-2 py-1 hover:bg-gray-700 rounded"
              >
                <FaShoppingCart className="text-yellow-500" />
                <span>Cart</span>
              </Link>
              <button
                onClick={handleLogOut}
                className="flex items-center gap-2 px-2 py-1 hover:bg-gray-700 rounded"
              >
                <MdLogout className="text-yellow-500" />
                <span className="whitespace-nowrap">Log Out</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
