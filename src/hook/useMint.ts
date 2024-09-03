import { NFT_SOULBOUND_ABI } from "@/utils/veenox";
import axios from "axios";
import { useCallback, useState } from "react";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { sepolia } from "viem/chains";
import { useAccount } from "wagmi";

const JWT = "";

const contractAddress = "0xf8e81D47203A594245E36C48e151709F0C19fBe8";

export const useTradePosterContract = () => {
  const { address } = useAccount();
  const [isMintLoading, setIsMintLoading] = useState(false);
  const [isMintSuccess, setIsMintSuccess] = useState(false);
  const [mintError, setMintError] = useState(null);

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  });

  const uploadImageToPinata = async (imageData) => {
    const formData = new FormData();
    const blob = await fetch(imageData).then((r) => r.blob());
    formData.append("file", blob, "tradePoster.png");

    const pinataMetadata = JSON.stringify({
      name: "Trade Poster",
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", pinataOptions);
    console.log("PINATA");
    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: `Bearer ${JWT}`,
          },
        }
      );
      console.log(" res.data.IpfsHash", res.data.IpfsHash);
      return res.data.IpfsHash;
    } catch (error) {
      console.log("Erreur lors de l'upload de l'image sur Pinata:", error);
      throw error;
    }
  };

  const createMetadata = (imageCID, tradeData) => {
    return {
      name: `Trade Poster #${tradeData.id}`,
      description: "Un poster représentant un trade réussi",
      image: `ipfs://${imageCID}`,
      attributes: [
        { trait_type: "Paire de trading", value: tradeData.pair },
        { trait_type: "Profit", value: `${tradeData.profit}%` },
        { trait_type: "Date", value: tradeData.date },
      ],
    };
  };

  const mintToken = useCallback(
    async (imageData, tradeData) => {
      console.log("metadataRes", tradeData);
      setIsMintLoading(true);
      setMintError(null);
      try {
        console.log("trade", tradeData);
        const imageCID = await uploadImageToPinata(imageData);
        console.log("imageCID", imageCID);
        const metadata = createMetadata(imageCID, tradeData);
        console.log("metadata", metadata);

        const metadataRes = await axios.post(
          "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          metadata,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${JWT}`,
            },
          }
        );

        console.log("metadataRes", metadataRes);

        const tokenURI = `ipfs://${metadataRes.data.IpfsHash}`;
        console.log("tokenURI", tokenURI);
        const { request } = await publicClient.simulateContract({
          address: contractAddress,
          abi: NFT_SOULBOUND_ABI,
          functionName: "mintTradePoster",
          args: [address, tokenURI],
          account: address,
        });
        console.log("Minting successful. request", request);
        const hash = await walletClient.writeContract(request);

        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        setIsMintSuccess(true);
        console.log("Minting successful. Transaction hash:", hash);
        return receipt;
      } catch (error) {
        console.log("Erreur lors du minting:", error);
        setMintError(error);
        throw error;
      } finally {
        setIsMintLoading(false);
      }
    },
    [address, contractAddress, publicClient, walletClient]
  );

  return {
    mintToken,
    isMintLoading,
    isMintSuccess,
    mintError,
  };
};
