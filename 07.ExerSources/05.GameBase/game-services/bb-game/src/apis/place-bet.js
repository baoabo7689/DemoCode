import mongoose from "mongoose";
const UserInfo = mongoose.model("UserInfo");

export const getBalance = async (user, captureBalance) => {
  const session = user.session;
  const balance = await UserInfo.findOne({ id: session.userId }).exec();
  
  return {
     isOk: true, 
     response: { red: balance.red }
  };
};


export const placeBet = async (user, betInfo) => {
  const betAmount = betInfo.amount;
  const balance = await getBalance(user);

  if (balance.response.red < betAmount) {
      return { 
        isOk: false,
        response: { inSufficientBalance: true } 
      };
  }

  const data = await UserInfo.findOne({ id: user.session.userId }).exec();
  data.red -= betAmount;
  await data.save();
  
  return balance;
};