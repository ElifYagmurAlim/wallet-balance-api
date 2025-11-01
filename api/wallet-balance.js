import 'dotenv/config';
import { ethers } from "ethers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  if (!ethers.isAddress(address)) {
    return res.status(400).json({ error: "Invalid Ethereum address" });
  }

  const apiKey = process.env.ALCHEMY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Alchemy API key is not configured" });
  }

  const network = "eth-mainnet";
  const apiUrl = `https://${network}.g.alchemy.com/v2/${apiKey}`;
  
  try {
    const provider = new ethers.JsonRpcProvider(apiUrl);
    const balance = await provider.getBalance(address);
    const formattedBalance = ethers.formatEther(balance);

    return res.status(200).json({ address, balance: formattedBalance });
  } catch (error) {
    console.error("Error fetching balance:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

