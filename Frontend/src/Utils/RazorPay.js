import axios from "axios";
import API from '../apiBase';

const handelPay = async (total, toke, orderIds) => {
  try {
    const createOrderResponse = await axios.post(
      `${API}/payment/create-order`,
      {
        amount: total,
        currency: "INR",
      }
    );
    const { amount, id: orderId, currency } = createOrderResponse.data.orders;

    const response = await axios.get(
      `${API}/payment/get-razorpay-key`
    );

    const keys = response.data;

    const options = {
      key: keys.key,
      amount: amount,
      currency: currency,
      name: "Ecom Follow along",
      description: "Test Transaction",
      image:
        "https://cdn.vectorstock.com/i/500p/22/42/eco-green-leaf-concept-vector-1722242.jpg",
      order_id: orderId,
      handler: async function (response) {
        const result = await axios.post(
          `${API}/payment/pay-order?token=${token}`,
          {
            amount: amount,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            orderIds,
          }
        );
        alert(result.data.message);
      },
      prefill: {
        name: "Nayan Kumar",
        email: "naayaankumar@gmail.com",
        contact: "9481574558",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "yellow",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (error) {
    console.log(error.message);
  }
};

export default handelPay;
