import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartList } from "@/interface/cartInterface";

const CartPage: React.FC = () => {
  const [cartProductList, setCartProductList] = useState<CartList>([]);

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5555/cart");
        setCartProductList(response.data.cartProducts);
      } catch (error) {
        console.error("Error fetching cart products:", error);
      }
    };

    fetchCartProducts();
  }, []);

  const removeFromCart = async (productId: string) => {
    try {
      await axios.delete(`http://localhost:5555/cart/${productId}`);
      setCartProductList((prevList) =>
        prevList.filter((product) => product._id !== productId)
      );
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      await axios.patch(`http://localhost:5555/cart/${id}`, { quantity });
      setCartProductList((prevList) =>
        prevList.map((product) =>
          product._id === id ? { ...product, quantity } : product
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-yellow-500">
        Shopping Cart
      </h1>
      {cartProductList.length === 0 ? (
        <p className="text-center">
          Your cart is empty.{" "}
          <Link to="/" className="text-yellow-500">
            Go to shop
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {cartProductList.map((product) => (
            <div
              key={product._id}
              className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between"
            >
              <div className="flex items-center">
                <img
                  src={`http://localhost:5555/uploads/${product.image}`}
                  alt={product.name}
                  className="w-16 h-16 rounded-md object-cover mr-4"
                />
                <div>
                  <h2 className="text-xl font-semibold text-yellow-500">
                    {product.name}
                  </h2>
                  <p className="text-gray-400">₹{product.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-md mr-2"
                  onClick={() => removeFromCart(product._id)}
                >
                  Remove
                </button>
                <div className="flex items-center border rounded border-gray-500 overflow-hidden">
                  <button
                    onClick={() =>
                      updateQuantity(product._id, product.quantity - 1)
                    }
                    className="bg-yellow-500 text-black px-2 py-1 hover:bg-yellow-600 font-bold"
                    disabled={product.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-white text-black">
                    {product.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(product._id, product.quantity + 1)
                    }
                    className="bg-yellow-500 text-black px-2 py-1 hover:bg-yellow-600 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {cartProductList.length > 0 && (
        <div className="text-right mt-6">
          <Link to="/checkout">
            <span className="bg-yellow-500 text-gray-900 px-6 py-2 rounded-md">
              Proceed to Checkout
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;
