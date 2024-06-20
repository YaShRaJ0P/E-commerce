import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useEffect, useState } from "react";
import CheckoutForm from "./CheckOutForm";

const Payment = () => {
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState<string>("");

  useEffect(() => {
    axios
      .get("http://localhost:5555/config")
      .then((res) => {
        const { publishableKey } = res.data;
        console.log("Publishable Key:", publishableKey);
        setStripePromise(loadStripe(publishableKey));
      })
      .catch((error) => {
        console.error("Error fetching config:", error);
      });

    axios
      .post("http://localhost:5555/payment", {
        product: { name: "Sample Product", price: 1000 },
        token: { email: "customer@example.com" },
      })
      .then((res) => {
        console.log("Client Secret:", res.data.clientSecret);
        setClientSecret(res.data.clientSecret);
      })
      .catch((err) => {
        console.error("Error creating payment:", err);
      });
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      {stripePromise && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-yellow-500 text-2xl mb-4 text-center">
              Complete Your Payment
            </h2>
            <CheckoutForm clientSecret={clientSecret} />
          </div>
        </Elements>
      )}
    </div>
  );
};

export default Payment;
