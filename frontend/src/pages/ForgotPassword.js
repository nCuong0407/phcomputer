import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/index";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validValue = Object.values(data).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      "Sending request to:",
      "/forgot-password",
      "with method:",
      "post",
      "and data:",
      data
    ); // Debug log
    console.log("Full URL:", window.location.origin + "/forgot-password"); // Debug full URL

    try {
      const response = await Axios({
        method: "post",
        url: "/forgot-password",
        data: data,
      });

      console.log("Response from server:", response.data); // Debug log
      if (response.data.error) {
        toast.error(response.data.message);
      } else if (response.data.success) {
        toast.success(response.data.message);
        navigate("/verification-otp", { state: data });
        setData({ email: "" });
      }
    } catch (error) {
      console.log(
        "Error details:",
        error.response ? error.response.data : error.message
      ); // Debug log
      console.log(
        "Error status:",
        error.response ? error.response.status : "No status"
      ); // Debug status
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p className="font-semibold text-lg">Forgot Password </p>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <button
            disabled={!validValue}
            className={`${
              validValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Send Otp
          </button>
        </form>
        <p>
          Already have account?{" "}
          <Link
            to={"/login"}
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;
