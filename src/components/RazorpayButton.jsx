import axios from "axios";

export default function RazorpayButton() {
  const openCheckout = async () => {
    try {
      // 1️⃣ Create order (backend call)
      const orderResponse = await axios.post(
        "https://localhost:7146/create-razorpay-order",
        {
          amount: 399,
          currency: "INR"
        }
      );

      const { orderId, amount, currency } = orderResponse.data;

      // 2️⃣ Configure Razorpay
    const options = {
  key: "rzp_test_S6LJUzipq6s7Dj",
  amount,
  currency,
  order_id: orderId,
  name: "WebsiteHub",
  description: "Payment for service",

  handler: async function (response) {
    await axios.post(
      "https://localhost:7146/verify-razorpay-payment",
      {
        RazorpayPaymentId: response.razorpay_payment_id,
        RazorpayOrderId: response.razorpay_order_id,
        RazorpaySignature: response.razorpay_signature
      }
    );

    alert("Payment successful");
  },

  modal: {
    ondismiss: function () {
      alert("Payment window closed. No payment was completed.");
    }
  },

  prefill: {
    name: "Sathish Sundharajan",
    email: "sathishsundharajan0609@gmail.com",
    contact: "9087123723"
  },

  theme: {
    color: "#3399cc"
  }
};


      // 4️⃣ Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error(error);
      alert("Payment failed");
    }
  };

  return (
    <button onClick={openCheckout}>
      Pay ₹399
    </button>
  );
}

