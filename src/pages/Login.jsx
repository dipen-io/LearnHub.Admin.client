import { useState } from "react";
import { LoginUser } from "../service/user";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom"
import useAuthStore from "../context/useAuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { login } = useAuthStore()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: (usersData) => LoginUser(usersData),
    onSuccess: (response) => {
      toast.success(response.message);
      login(response.data, response.accessToken)
      navigate("/")
    },
    onError: (error) => {
      if (!error.response) {
        toast.error("Network error. Please try again later.");
        return;
      }
      const err = error.response.data?.error;
      if (err?.statusCode === 404) {
        setEmailError(err.message);
      }
      if (err?.statusCode === 401) {
        setPasswordError(err.message);
      }
      toast.error(err?.message || "Login failed");
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    const usersData = {
      email,
      password,
      Roles: "admin",
    };

    loginMutation.mutate(usersData);
  };

  return (
    <div className="flex w-full flex-col justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      <h1 className="text-3xl font-bold mb-8">LOGIN HERE</h1>

      <form
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-80 sm:w-96"
        onSubmit={handleLogin}
      >
        <div className="flex flex-col text-gray-300 mb-4">
          <label htmlFor="email" className="mb-1 text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="Enter your email"
            required
            className="p-2 rounded-lg bg-gray-700 focus:bg-gray-600 focus:border-blue-500 focus:outline-none border border-transparent"
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
              setPasswordError("");
            }}
          />
          {emailError && (
            <div className="text-red-500 text-sm mt-1">{emailError}</div>
          )}
        </div>

        <div className="flex flex-col text-gray-300 mb-6">
          <label htmlFor="password" className="mb-1 text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="Enter your password"
            required
            className="p-2 rounded-lg bg-gray-700 focus:bg-gray-600 focus:border-blue-500 focus:outline-none border border-transparent"
            onChange={(e) => {
              setPassword(e.target.value);
              setEmailError("");
              setPasswordError("");
            }}
          />
          {passwordError && (
            <div className="text-red-500 text-sm mt-1">{passwordError}</div>
          )}
        </div>

        <div className="flex justify-between items-center text-gray-400 text-sm mb-6">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <a href="#" className="hover:text-blue-400">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isLoading}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-semibold disabled:opacity-50"
        >
          {loginMutation.isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

