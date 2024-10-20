const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  try {
    // slat rounds = 10
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

const comparePassword = async (enteredPassword, hashedPassword) => {  
  try {
    const isMatch = await bcrypt.compare(enteredPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error("Error comparing password:", error);
    throw error;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};
