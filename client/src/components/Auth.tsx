import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/utils/userStore";

const Auth = () => {
  const dispatch = useDispatch();
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setFormData({ username: "", email: "", password: "" });
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let response;
      if (isLoginView) {
        response = await axios.post(
          "http://localhost:5555/auth/login",
          formData,
          {
            withCredentials: true,
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:5555/auth/signup",
          formData,
          {
            withCredentials: true,
          }
        );
      }

      dispatch(
        setUser({ username: response.data.username, userId: response.data.id })
      );

      Cookies.set("token", response.data.token, {
        expires: 1,
        sameSite: "Strict",
      });

      alert(`User ${isLoginView ? "logged in" : "registered"} successfully`);
      navigate("/");
    } catch (error) {
      setError("Failed to authenticate. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="grid place-items-center h-full">
      <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg max-w-md mx-auto border-[#283756] border-2 w-1/2">
        <h2 className="text-2xl font-bold mb-4 text-yellow-500">
          {isLoginView ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLoginView && (
            <div className="mb-4">
              <label className="block text-gray-400 mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white"
              required
              autoComplete="on"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-md w-full"
          >
            {isLoginView ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-4">
          {isLoginView ? (
            <>
              Don't have an account?{" "}
              <button
                className="text-yellow-500 underline"
                onClick={toggleView}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-yellow-500 underline"
                onClick={toggleView}
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;
