import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/appStore";
import {
  setCart,
  removeItemFromCart,
  updateItemQuantity,
  setTotalPrice,
} from "@/utils/cartStore";
import { CartItem } from "@/interface/cartInterface";

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const { items: cartProductList, totalPrice } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5555/cart", {
          withCredentials: true,
        });
        const cartItems = data.cartProducts;
        const price = cartItems.reduce(
          (sum: number, item: CartItem) =>
            sum + item.product.price * item.quantity,
          0
        );
        dispatch(setCart(cartItems));
        dispatch(setTotalPrice(price));
      } catch (error) {
        console.error("Error fetching cart products:", error);
      }
    };

    fetchCartProducts();
  }, [dispatch]);

  const handleRemoveFromCart = async (productId: string) => {
    try {
      await axios.delete(`http://localhost:5555/cart/${productId}`, {
        withCredentials: true,
      });
      dispatch(removeItemFromCart(productId));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    try {
      await axios.patch(
        `http://localhost:5555/cart/${id}`,
        { quantity },
        { withCredentials: true }
      );
      dispatch(updateItemQuantity({ id, quantity }));
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
          {cartProductList.map((cartProduct) => (
            <div
              key={cartProduct.product._id}
              className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between"
            >
              <div className="flex items-center">
                <img
                  src={`http://localhost:5555/uploads/${cartProduct.product.image}`}
                  alt={cartProduct.product.name}
                  className="w-16 h-16 rounded-md object-cover mr-4"
                />
                <div>
                  <h2 className="text-xl font-semibold text-yellow-500">
                    {cartProduct.product.name}
                  </h2>
                  <p className="text-gray-400">₹{cartProduct.product.price}</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-md mr-2"
                  onClick={() => handleRemoveFromCart(cartProduct.product._id)}
                >
                  Remove
                </button>
                <div className="flex items-center border rounded border-gray-500 overflow-hidden">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        cartProduct.product._id,
                        cartProduct.quantity - 1
                      )
                    }
                    className="bg-yellow-500 text-black px-2 py-1 hover:bg-yellow-600 font-bold"
                    disabled={cartProduct.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-white text-black">
                    {cartProduct.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        cartProduct.product._id,
                        cartProduct.quantity + 1
                      )
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
        <div className="text-right mt-6 flex flex-col gap-2">
          <span>{totalPrice > 0 && "Total Price : ₹" + totalPrice}</span>
          <Link to="/pay">
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
