import "dotenv/config";
import { ethers } from "ethers";

async function main() {
  const apiKey = process.env.ALCHEMY_API_KEY;
  if (!apiKey) {
    console.error("Alchemy API key is not configured in .env file");
    return;
  }
  
  const provider = new ethers.JsonRpcProvider(
    `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`
  );

  // Vitalik’in adresini test edelim:
  const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

  try {
    const balanceWei = await provider.getBalance(address);
    const balanceEth = ethers.formatEther(balanceWei);
    console.log(`✅ Balance of ${address}: ${balanceEth} ETH`);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();