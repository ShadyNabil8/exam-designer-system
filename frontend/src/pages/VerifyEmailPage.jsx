import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Form, useNavigate, Link, useSearchParams } from "react-router-dom";
import api from "../api/api";
import useNotifier from "../hooks/useNotifier";
import { CgSpinner } from "react-icons/cg";

const VerifyEmailPage = () => {
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const { user, setUser } = useAuth();

  const inputRef = useRef(null);
  const verificationEffectRan = useRef(false);
  const notify = useNotifier();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const verificationCodeParam = searchParams.get("verificationCode");

  const verifyEmail = async (verificationCode) => {
    try {
      await api.post("/api/users/verify-email", {
        verificationCode,
      });
      setUser((prev) => ({
        ...prev,
        isVerified: true,
      }));
      navigate("/courses");
    } catch (error) {
      console.log(error);
      notify.error(
        error.response?.data?.message ||
          error.response?.data?.errors[0]?.msg ||
          "Something went wrong!",
      );
      throw error;
    }
  };

  const resendVerificationCode = async (email) => {
    try {
      await api.post("/api/users/resend-verification-code", { email });
      notify.success("Verification code has been resent");
    } catch (error) {
      notify.error(
        error.response?.data?.message ||
          error.response?.data?.errors[0]?.msg ||
          "Something went wrong!",
      );
    }
  };

  const handleValidation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyEmail(verificationCode);
    } catch (error) {
      // Error is handled within verifyEmail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    document.title = "Verify Email | Exam Generation System";
  }, []);

  useEffect(() => {
    if (verificationEffectRan.current === false && verificationCodeParam) {
      setLoading(true);
      verifyEmail(verificationCodeParam).finally(() => setLoading(false));
      verificationEffectRan.current = true;
    }
  }, [verificationCodeParam]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#FAFBFC]">
      <Form
        className="absolute left-1/2 top-1/2 flex min-h-[460px] w-[347px] -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-lg bg-white px-[22px] py-10 shadow-2xl md:w-[480px] md:px-16"
        onSubmit={handleValidation}
      >
        <p className="mb-8 text-3xl font-bold">Seconds to sign up!</p>
        <p className="self-start text-2xl">We just emailed you.</p>
        <p className="text-md mt-4 self-start">
          Please enter the code we emailed you.
        </p>
        <p className="text-md self-start">{user.email}</p>
        <p className="mt-4 self-start text-sm">Confirmation code</p>
        <input
          ref={inputRef}
          className="mt-1 w-full border-b text-center text-[32px] focus:outline-none"
          value={verificationCode || verificationCodeParam || ""}
          onChange={(e) => setVerificationCode(e.target.value)}
        ></input>
        <button
          style={loading ? { pointerEvents: "none" } : {}}
          className="mt-6 flex h-[50px] w-full shrink-0 items-center justify-center rounded-lg bg-[#5F55EE] font-medium text-white transition-colors hover:bg-[#544DC9]"
          type="submit"
        >
          {loading ? (
            <CgSpinner className="animate-spin text-3xl text-white" />
          ) : (
            "Verify"
          )}
        </button>
        <div className="absolute bottom-2 flex gap-1 text-[13px] text-[#4f7cdd]">
          <button
            className="underline"
            type="button"
            onClick={(e) => resendVerificationCode(user.email)}
          >
            Resend code
          </button>
        </div>
      </Form>
    </div>
  );
};

export default VerifyEmailPage;
