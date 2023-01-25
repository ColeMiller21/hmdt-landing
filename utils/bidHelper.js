const validateBidAmount = (bidAmount, user) => {
  if (bidAmount == 0) {
    //show toast message
    const message = "Bid amount cannot be 0";
    return { success: false, message };
  }
  if (bidAmount > user?.totalBalance) {
    //show a toast message
    const message = `Do not have enough $HP to make bid: ${bidAmount}`;
    return { success: false, message };
  } else if (bidAmount <= user?.bidAmount) {
    //show a toast message
    const message = `You cannot bid less or equal then you already have bid.`;
    return { success: false, message };
  }
  return { success: true };
};

export { validateBidAmount };
