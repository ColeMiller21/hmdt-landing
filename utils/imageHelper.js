const baseUrl =
  "https://fafz.mypinata.cloud/ipfs/QmS3g1MArz2x45SNjYmADoeVdrP7wkH9qAZGksEAQrSKJk/";
const ext = ".png";

export const createImageUrl = (tokenId) => {
  return `${baseUrl}${tokenId}${ext}`;
};
