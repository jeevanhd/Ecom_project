import axios from "axios";
import React, { useEffect, useState } from "react";
import CartCard from "../Components/ProductCard/CartCard";
import { useSelector } from "react-redux";
import API from '../apiBase';

const OrderHistoryPage = () => {
  const [orderData, setOrderData] = useState([]);
  const data = useSelector((state) => state.user);

  const fetchOrderProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return alert("Token not found");
    }
    try {
      const response = await axios.get(
        `${API}/orders/user-orders-data?token=${token}`
      );

      const reverseData = response.data.orders?.reverse();
      setOrderData(reverseData);
      console.log(response.data.orders);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrderProducts();
  }, []);

  const handleCancelOrder = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return alert("Token not found");
    }

    try {
      await axios.patch(
        `${API}/orders/cancel-order?token=${token}&orderId=${id}`
      );

      fetchOrderProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {orderData?.map((data, index) => {
        return (
          <div key={index}>
            <CartCard
              title={data.orderItems.title}
              images={data.orderItems.images[0]}
              //   Index={index}
              description={data.orderItems.description}
              originalPrice={data.orderItems.originalPrice}
              discountedPrice={data.orderItems.discountedPrice}
              id={data._id}
              orderStatus={data.orderStatus}
              createdBy={"jeev@hd.com"}
              handleCancelOrder={handleCancelOrder}
            />
          </div>
        );
      })}
    </div>
  );
};

export default OrderHistoryPage;
