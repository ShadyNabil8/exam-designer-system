const { transporter } = require("../config/transporter");
const { CustomError } = require("../middlewares/errorHandlerMiddleware");
require("dotenv").config();

const sendVerificationCode = async (receiverEmail, verificationCode) => {
  try {
    await transporter.sendMail({
      from: process.env.TRANSPORTER_EMAIL,
      to: receiverEmail,
      subject: "Verification Code",
      text: `Your verification code is: ${verificationCode}. Or click the link: http://localhost:5173/verify-email?verificationCode=${verificationCode}`,
    });
  } catch (error) {
    throw new CustomError("Failed to send verification email", 500);
  }
};

module.exports = { sendVerificationCode };
