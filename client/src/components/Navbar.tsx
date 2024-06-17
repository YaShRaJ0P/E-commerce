import { Link } from "react-router-dom";
import { useState } from "react";
import { HiUserCircle } from "react-icons/hi";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

export const Navbar = () => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className="px-8 py-4 bg-gray-900 text-white shadow-md border-b-2 border-white mb-2">
      <nav className="flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-yellow-500 hover:text-yellow-400"
        >
          Shopease
        </Link>
        <div className="relative">
          <button
            onClick={() => setDropdown(!dropdown)}
            className="focus:outline-none"
          >
            <HiUserCircle className="text-4xl text-yellow-500 hover:text-yellow-400" />
          </button>
          <div
            className={`${
              dropdown ? "absolute" : "hidden"
            } bg-gray-800 rounded-md p-3 flex flex-col -left-20 gap-2 border-slate-700 border-2 mt-2 z-10`}
          >
            <Link
              to="/"
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-700 rounded"
            >
              <FaUser className="text-yellow-500" />
              <span>Profile</span>
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-700 rounded"
            >
              <FaShoppingCart className="text-yellow-500" />
              <span>Cart</span>
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-700 rounded"
            >
              <MdLogout className="text-yellow-500" />
              <span className="whitespace-nowrap">Log Out</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};
