const { transporter } = require("../config/transporter");
const { CustomError } = require("../middlewares/errorHandlerMiddleware");
require("dotenv").config();

const sendVerificationCode = async (receiverEmail, verificationCode) => {
  try {
    await transporter.sendMail({
      from: process.env.TRANSPORTER_EMAIL,
      to: receiverEmail,
      subject: "Verification Code",
      text: `Your verification code is: ${verificationCode}. Or click the link: ${process.env.CLIENT_DOMAIN}/verify-email?verificationCode=${verificationCode}`,
    });
  } catch (error) {
    throw new CustomError("Failed to send verification email", 500);
  }
};

module.exports = { sendVerificationCode };
