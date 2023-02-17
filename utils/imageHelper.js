import { Network, Alchemy } from "alchemy-sdk";

const baseUrl =
  "https://fafz.mypinata.cloud/ipfs/QmS3g1MArz2x45SNjYmADoeVdrP7wkH9qAZGksEAQrSKJk/";
const ext = ".png";

export const createImageUrl = (tokenId) => {
  return `${baseUrl}${tokenId}${ext}`;
};

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID, // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

function parseIPFS(ipfs) {
  return ipfs.replace("ipfs://", "https://fafz.mypinata.cloud/ipfs/");
}

export const getUserNFTS = async (address) => {
  const nftsForOwner = await alchemy.nft.getNftsForOwner(address, {
    contractAddresses: [
      "0x9aF34C11B400e0c8498cb4721299e0501f520760",
      "0xdf0F0A5508Aa4f506e5bDC8C45C8879E6E80d3e4",
    ],
  });

  let ownedHMDT = nftsForOwner.ownedNfts
    .filter((data) => {
      if (data.contract.symbol === "HMDT") {
        return data.rawMetadata;
      }
    })
    .map((data) => {
      data.rawMetadata.image = parseIPFS(data.rawMetadata.image);
      data.rawMetadata.openSea =
        "https://opensea.io/assets/ethereum/0xdf0f0a5508aa4f506e5bdc8c45c8879e6e80d3e4/" +
        data.rawMetadata.edition;
      return data.rawMetadata;
    });

  let ownedHMGT = nftsForOwner.ownedNfts
    .filter((data) => {
      if (data.contract.symbol === "GIFT") {
        return data.rawMetadata;
      }
    })
    .map((data) => {
      data.rawMetadata.image = parseIPFS(data.rawMetadata.image);
      data.rawMetadata.openSea =
        "https://opensea.io/assets/ethereum/0x9af34c11b400e0c8498cb4721299e0501f520760/" +
        data.rawMetadata.edition;
      return data.rawMetadata;
    });

  return { ownedHMDT, ownedHMGT };
};
