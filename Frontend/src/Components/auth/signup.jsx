import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validate_obj from "../../Validation.js";
import API from '../../apiBase';

const SignupForm = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    file: "",
  });
  const [error, setError] = useState("");

  const navigator = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setData({
        ...data,
        [name]: files[0],
      });
    } else {
      setData({
        ...data,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const Namev = Validate_obj.validateName(data.name);
    const Emailv = Validate_obj.validateEmail(data.email);
    const Passv = Validate_obj.validatePassword(data.password);

    if (typeof Namev === "string" && Namev.length > 1) {
      return setError(Namev);
    }
    if (typeof Emailv === "string" && Emailv.length > 2) {
      return setError(Emailv);
    }
    if (typeof Passv === "string" && Passv.length > 2) {
      return setError(Passv);
    }

    setError("");

    const formDataBody = new FormData();
    formDataBody.append("name", data.name);
    formDataBody.append("email", data.email);
    formDataBody.append("password", data.password);
    formDataBody.append("file", data.file);

    try {
      await axios.post(`${API}/user/signup`, formDataBody, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigator("/login");
    } catch (err) {
      setError("Signup failed. Please try again.");
      console.log("Something wrong happened ", err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        {/* Name  */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="Enter Your Name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Email  */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password  */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* File upload  */}
        <div className="mb-6">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
            Upload File
          </label>
          <input
            type="file"
            id="file"
            name="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {/* Submit Button  */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Sign Up
        </button>
        <p className="text-center">
          Have an account{" "}
          <Link to={"/login"} className="text-blue-500">
            login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
