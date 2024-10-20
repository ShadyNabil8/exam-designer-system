const database = require("../database");
const asyncHandler = require("express-async-handler");

const checkCooldownPeriod = asyncHandler(async function (userId) {
  const recentVerificationCodes = await database.findVerificationCodesAndSort(
    userId
  );

  if (recentVerificationCodes.length === 0) {
    return { canResend: true };
  }

  const now = new Date();
  const createdAt = recentVerificationCodes[0].createdAt;

  const timeDifferenceInSeconds = (now - createdAt) / 1000;

  if (timeDifferenceInSeconds < 60) {
    const timeRemaining = Math.floor(60 - timeDifferenceInSeconds);
    return { canResend: false, timeRemaining };
  }

  return { canResend: true };
});

module.exports = {
  checkCooldownPeriod,
};
