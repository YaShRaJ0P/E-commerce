import { setProducts } from "@/utils/products";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaChevronDown, FaCheck } from "react-icons/fa6";
import { useDispatch } from "react-redux";

export const Filter = () => {
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [priceRange, setPriceRange] = useState<number>(0);
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "All"
  );
  const [sortType, setSortType] = useState<string>("Latest");
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("http://localhost:5555/category")
      .then((response) => {
        setCategories(["All", ...response.data.categories]);
      })
      .catch((error) => {
        console.error("Failed to fetch categories:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedCategory !== null) {
      fetchFilteredData(selectedCategory, priceRange, sortType);
    }
  }, [selectedCategory, priceRange, sortType]);

  const fetchFilteredData = (category: string, price: number, sort: string) => {
    const url = `http://localhost:5555/filter?category=${encodeURIComponent(
      category
    )}&priceRange=${encodeURIComponent(price)}&sort=${encodeURIComponent(
      sort
    )}`;
    axios
      .get(url)
      .then((response) => {
        dispatch(setProducts(response.data));
      })
      .catch((error) => {
        console.error("Failed to fetch filtered products:", error);
      });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handlePriceRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseInt(e.target.value);
    setPriceRange(price);
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(e.target.value);
  };

  return (
    <aside className="py-6 px-4 bg-gray-900 border-r-2 border-gray-700 w-full max-w-xs min-w-48">
      <div className="mb-6">
        <label
          htmlFor="Range"
          className="block text-lg font-bold text-white mb-2"
        >
          Max Price :{" "}
          <span className="text-yellow-400">{priceRange || "None"}</span>
        </label>
        <input
          type="range"
          name="Range"
          id="Range"
          value={priceRange}
          min="0"
          max="10000"
          step="500"
          onChange={handlePriceRange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="Sort"
          className="block text-lg font-bold text-white mb-2"
        >
          Sort By
        </label>
        <select
          name="Sort"
          id="Sort"
          className="w-full p-2 bg-gray-700 border border-gray-800 rounded-lg text-white"
          onChange={handleSort}
        >
          <option value="Latest">Latest</option>
          <option value="Ascending">Price: Low to High</option>
          <option value="Descending">Price: High to Low</option>
        </select>
      </div>

      <div className="mb-6">
        <div
          className="flex items-center justify-between p-2 bg-gray-700 rounded-lg cursor-pointer text-lg font-bold text-white"
          onClick={() => setDropdown(!dropdown)}
        >
          <span>Categories</span>
          <FaChevronDown
            className={`transition-transform duration-300 ${
              dropdown ? "rotate-180" : ""
            }`}
          />
        </div>
        <div
          className={`mt-2 ${
            dropdown ? "block" : "hidden"
          } transition-all duration-300`}
        >
          {categories.map((category, index) => (
            <label
              key={index}
              className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white rounded-lg mt-1 hover:bg-gray-700 cursor-pointer"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedCategory === category}
                  onChange={() => handleCategoryChange(category)}
                />
                <span className="ml-2">{category}</span>
              </div>
              {selectedCategory === category && (
                <FaCheck className="text-green-500 ml-2" />
              )}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};
