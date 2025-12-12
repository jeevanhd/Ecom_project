import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CartCard from "../Components/ProductCard/CartCard";
import API from '../apiBase';

const CartPage = () => {
  const [UsersCartData, setUsersCartData] = useState([]);

  const handleCancelOrder = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `${API}/cart/delete-from-cart?token=${token}&id=${productId}`
      );
      // Update local state by removing the deleted item
      setUsersCartData(prev => prev.filter(item => item.productId._id !== productId));
    } catch (error) {
      console.error("Error deleting cart item:", error);
      alert("Failed to delete item from cart. Please try again.");
    }
  };

  const data = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const getCartData = async () => {
      const token = localStorage.getItem("token");
      console.log("Token retrieved:", token);

      if (!token) {
        return alert("Token is missing");
      }

      try {
        const response = await axios.get(
          `${API}/cart/get-user-cart-data?token=${token}`
        );
        setUsersCartData(response.data.cartData);
      } catch (error) {
        console.error("Error fetching cart data:", error.response);
        if (error.response.status === 401) {
          alert("UnAuthorized Access... redirecting to login ");
          navigate("/login");
        } else {
          alert(
            "Failed to fetch cart data. Please check your authentication. or login again"
          );
        }
      }
    };

    getCartData();
  }, []);

  return (
    <div>
      {UsersCartData.length > 0 ? (
        <>
          <Link to={`/select-address`}>
            <button className="bg-slate-800 text-white px-5 py-2 rounded-md ml-40">
              Checkout
            </button>
          </Link>
          {UsersCartData?.map((data, index) => {
            return (
              <div key={index}>
                <CartCard
                  title={data.productId?.title}
                  images={data.productId?.images[0]}
                  description={data.productId?.description}
                  originalPrice={data.productId?.originalPrice}
                  discountedPrice={data.productId?.discountedPrice}
                  id={data.productId?._id}
                  createdBy={"jeev@hd.com"}
                  handleCancelOrder={handleCancelOrder}
                />
              </div>
            );
          })}
        </>
      ) : (
        <div className="flex justify-center max-h-[100vh] items-center">
          <h1>Cart is empty</h1>
        </div>
      )}
    </div>
  );
};

export default CartPage;
