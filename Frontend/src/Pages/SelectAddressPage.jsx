import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddressList from "../Components/Profile/AddressList";
import API from '../apiBase';

const SelectAddressPage = () => {
  const [allAddresses, setAllAddress] = useState([]);
  const data = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to access your addresses");
        return;
      }

      try {
        const response = await axios.get(
          `${API}/user/get-address?token=${token}`
        );
        setAllAddress(response.data.userInfo.address);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        alert("Failed to fetch addresses. Please try again later.");
      }
    };

    fetchAddresses();
  }, []);

  return (
    <div>
      <AddressList addresses={allAddresses} />
    </div>
  );
};

export default SelectAddressPage;
