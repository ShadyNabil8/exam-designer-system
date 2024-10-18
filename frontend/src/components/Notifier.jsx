import React from "react";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Notifier = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={5000}
      draggable
      theme="light"
      transition={Slide}
    />
  );
};

export default Notifier;
