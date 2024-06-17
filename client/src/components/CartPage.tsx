import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartList } from "@/interface/cartInterface";

const CartPage = () => {
  const [cartProductList, setCartProductList] = useState<CartList>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5555/cart")
      .then((response) => {
        setCartProductList(response.data.cartProducts);
      })
      .catch((error) => {
        console.error("Error fetching cart products:", error);
      });
  }, [cartProductList]);

  const removeFromCart = async (productId: string) => {
    try {
      await axios.delete(`http://localhost:5555/cart/${productId}`);
    } catch (error) {
      console.error("Error removing item from cart:", error);
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
                  src={product.image}
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
