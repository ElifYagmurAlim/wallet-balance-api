import 'dotenv/config';
import { ethers } from "ethers"; // Ethers.js library for Ethereum interactions

export default async function handler(req, res) { //versel serverless function
  if (req.method !== "GET") { //only allow GET requests
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { address } = req.query; //get address from query parameters

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  if (!ethers.isAddress(address)) {
    return res.status(400).json({ error: "Invalid Ethereum address" });
  }

  const apiKey = process.env.ALCHEMY_API_KEY; //get alchemy api key from environment variables
  if (!apiKey) {
    return res.status(500).json({ error: "Alchemy API key is not configured" });
  }

  const network = "eth-mainnet"; //specify the network
  const apiUrl = `https://${network}.g.alchemy.com/v2/${apiKey}`; //construct the alchemy api url
  
  try {
    const provider = new ethers.JsonRpcProvider(apiUrl); //create a new provider using the alchemy api url this method allows us to connect to the ethereum network
    const balance = await provider.getBalance(address); //fetch the balance of the specified address
    const formattedBalance = ethers.formatEther(balance); //convert the balance from wei to ether wei is the smallest unit of ether

    return res.status(200).json({ address, balance: formattedBalance });
  } catch (error) {
    console.error("Error fetching balance:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

