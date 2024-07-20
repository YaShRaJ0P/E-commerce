import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useEffect, useState } from "react";
import CheckoutForm from "./CheckOutForm";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/appStore";

const Payment = () => {
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const totalPrice = useSelector((state: RootState) => state.cart.totalPrice);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    const fetchStripeConfig = async () => {
      try {
        const res = await axios.get("http://localhost:5555/config");
        const { publishableKey } = res.data;
        setStripePromise(loadStripe(publishableKey));
      } catch (error) {
        console.error("Error fetching config:", error);
        setError("Error fetching payment configuration. Please try again.");
        setLoading(false);
      }
    };

    fetchStripeConfig();
  }, []);

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!stripePromise) return;

      try {
        const res = await axios.post("http://localhost:5555/payment", {
          product: { items: cartItems, price: totalPrice },
          token: { email: "customer@example.com" },
        });

        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.error("Error creating payment:", err);
        setError("Error creating payment. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [stripePromise, cartItems, totalPrice]);

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      {loading ? (
        <div className="text-white">Loading...</div>
      ) : error ? (
        <div className="text-white">{error}</div>
      ) : (
        stripePromise &&
        clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret }}
            key={clientSecret}
          >
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-yellow-500 text-2xl mb-4 text-center">
                Complete Your Payment
              </h2>
              <CheckoutForm clientSecret={clientSecret} />
            </div>
          </Elements>
        )
      )}
    </div>
  );
};

export default Payment;
