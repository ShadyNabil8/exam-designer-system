import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Form, useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import useNotifier from "../hooks/useNotifier";
import { CgSpinner } from "react-icons/cg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const notify = useNotifier();

  const handleLogin = async (e) => {
    try {
      e.preventDefault();

      setLoading(true);

      // This response contins the access token and user data.
      const response = await api.post("/api/users/login", {
        email,
        password,
      });
      const accessToken = response.data.accessToken;
      const user = response.data.user;

      // login function inside the AuthContext is ised to set the auth state with token and user data.
      login(accessToken, user);
      navigate("/generate-exam");
    } catch (error) {
      notify.error(
        error.response?.data?.message ||
          error.response?.data?.errors[0]?.msg ||
          "Something went wrong!",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Login | Exam Generation System";
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#FAFBFC]">
      <Form
        className="absolute left-1/2 top-1/2 flex min-h-[460px] w-[347px] -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-lg bg-white px-[22px] py-10 shadow-2xl md:w-[480px] md:px-16"
        onSubmit={handleLogin}
      >
        <p className="text-3xl font-bold">Welcome back!</p>
        <div className="mt-4 flex w-full flex-col gap-1">
          <label htmlFor="email" className="self-start">
            Email
          </label>
          <input
            className="w-full rounded-md border bg-transparent p-3 text-sm focus:outline-none"
            placeholder="e.g., Email@Gmail.com"
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div className="mt-4 flex w-full flex-col gap-1">
          <label htmlFor="password" className="self-start">
            Password
          </label>
          <input
            className="w-full rounded-md border bg-transparent p-3 text-sm focus:outline-none"
            placeholder="e.g., Shady123@"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <button
          style={loading ? { pointerEvents: "none" } : {}}
          className="mt-9 flex h-[50px] w-full shrink-0 items-center justify-center rounded-lg bg-[#5F55EE] font-medium text-white transition-colors hover:bg-[#544DC9]"
          type="submit"
        >
          {loading ? (
            <CgSpinner className="animate-spin text-3xl text-white" />
          ) : (
            "Log in"
          )}
        </button>
        <div className="absolute -bottom-12 text-sm">
          <span className="text-sm">Don't have an account? </span>
          <Link to="/signup" className="text-blue-600 underline">
            Sign up
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
