import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/appStore";
interface CartItem {
  product: {
    _id: string;
  };
  quantity: number;
}

const ProductCard = ({
  name,
  price,
  image,
  stock,
  id,
}: {
  name: string;
  price: number;
  image: string;
  stock: number;
  id: string;
}) => {
  const [quantity, setQuantity] = useState(0);
  const [addToCart, setAddToCart] = useState(true);
  const [cartProductId, setCartProductId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = Cookies.get("token");

        if (!token) {
          setAddToCart(true);
          setQuantity(0);
          return;
        }

        const response = await axios.get("http://localhost:5555/cart", {
          withCredentials: true,
        });

        const cartItems: CartItem[] = response.data.cartProducts;

        const cartItem = cartItems.find(
          (item: CartItem) => item.product._id === id
        );

        if (cartItem) {
          setQuantity(cartItem.quantity);
          setAddToCart(false);
          setCartProductId(cartItem.product._id);
        }
      } catch (err) {
        console.error("Error fetching cart data:", err);
      }
    };

    fetchCartData();
  }, [user]);

  const handleIncrease = () => {
    const token = Cookies.get("token");
    if (!token) {
      setError("Please Login");
      return;
    }
    setQuantity(quantity < stock ? quantity + 1 : quantity);
  };
  const handleDecrease = () => setQuantity(quantity > 0 ? quantity - 1 : 0);

  const handleAddToCart = async () => {
    if (quantity === 0) return;

    try {
      if (addToCart) {
        const response = await axios.post(
          "http://localhost:5555/cart",
          {
            id,
            quantity,
          },
          {
            withCredentials: true,
          }
        );
        setCartProductId(response.data.id);
      } else {
        if (cartProductId) {
          await axios.delete(`http://localhost:5555/cart/${cartProductId}`, {
            withCredentials: true,
          });
          setCartProductId(null);
          setQuantity(0);
        }
      }
      setAddToCart(!addToCart);
      setError(null);
    } catch (err) {
      setError("Please Login.");
      console.error("Error adding/removing product to/from cart:", err);
    }
  };

  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden w-80">
      <img
        src={`http://localhost:5555/uploads/${image}`}
        alt={name}
        className="w-full h-48 object-fill"
      />
      <div className="p-4">
        <div className="flex flex-row justify-between w-full mb-2">
          <h3 className="text-xl font-bold text-yellow-500">{name}</h3>
          <h5 className="text-base text-white">Qty: {stock}</h5>
        </div>
        <p className="text-lg mb-4">₹{price}</p>
        <div
          className={`flex items-center ${
            addToCart ? "justify-between" : "justify-center"
          } mb-4`}
        >
          {addToCart && (
            <div className="flex items-center border rounded border-gray-500 overflow-hidden">
              <button
                onClick={handleDecrease}
                className="bg-yellow-500 text-black px-2 py-1 hover:bg-yellow-600 font-bold"
              >
                -
              </button>
              <span className="px-4 py-1 bg-white text-black">{quantity}</span>
              <button
                onClick={handleIncrease}
                className="bg-yellow-500 text-black px-2 py-1 hover:bg-yellow-600 font-bold"
              >
                +
              </button>
            </div>
          )}
          <button
            onClick={handleAddToCart}
            className="bg-yellow-500 text-black rounded px-4 py-2 hover:bg-yellow-600"
          >
            {addToCart ? "Add to Cart" : "Remove from Cart"}
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default ProductCard;
