import axios from "axios";
import { useState } from "react";

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

  const handleIncrease = () =>
    setQuantity(quantity < stock ? quantity + 1 : quantity);
  const handleDecrease = () => setQuantity(quantity > 0 ? quantity - 1 : 0);

  const handleAddToCart = async () => {
    if (quantity === 0) return;

    try {
      if (addToCart) {
        const response = await axios.post("http://localhost:5555/cart", {
          id,
          quantity,
        });
        setCartProductId(response.data.id);
      } else {
        if (cartProductId) {
          await axios.delete(`http://localhost:5555/cart/${cartProductId}`);
          setCartProductId(null);
        }
      }
      setAddToCart(!addToCart);
      setError(null);
    } catch (err) {
      setError("Failed to update cart. Please try again.");
      console.error(err);
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
        <div className="flex items-center justify-between mb-4">
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
