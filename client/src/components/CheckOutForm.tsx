import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface CheckoutFormProps {
  clientSecret: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setProcessing(true);

    const cardElement = elements?.getElement(CardElement);

    if (!stripe || !cardElement) {
      return;
    }

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: "Customer Name",
        },
      },
    });

    if (error) {
      setError(`Payment failed: ${error.message}`);
      setProcessing(false);
    } else {
      navigate("/");
      setError(null);
      setProcessing(false);
      setPaymentSucceeded(true);
      await axios.post(
        "http://localhost:5555/cart/empty",
        {},
        {
          withCredentials: true,
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-800 p-4 rounded shadow-lg">
        <CardElement className="p-2 border border-gray-600 rounded" />
      </div>
      <button
        type="submit"
        disabled={!stripe || processing || paymentSucceeded}
        className="w-full bg-yellow-500 text-gray-900 py-2 rounded hover:bg-yellow-600 transition-colors"
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {paymentSucceeded && (
        <div className="text-green-500 mt-2">Payment Succeeded!</div>
      )}
    </form>
  );
};

export default CheckoutForm;
