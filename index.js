import { ethers } from "./ethers-5.2.esm.min.js";
import { abi, contractAddress } from "./contants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");

// Initiating the functions
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;


async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      console.log('Requested...')
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    document.getElementById("connectButton").innerHTML = "Connected !!!";
  } else {
    document.getElementById("connectedButton").innerHTML = "Plese install MetaMask !!!";
  }
}


// fund function
async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  console.log(`Funding with ${ethAmount}`)

  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)

    try {
        const transactionResponse = await contract.fund({
          value: ethers.utils.parseEther(ethAmount)
        })
      await listenForTransactionMine(transactionResponse, provider)
      console.log('Done !!')
    } catch (error) {
      console.log(error)
    }
  }
}


function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash} ...`)
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceit) => {
      console.log(`Complete with ${transactionReceit.confirmations} confirmations`)
      resolve()
    })
  })
}

async function getBalance() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(ethers.utils.formatEther(balance))
  }
}

async function withdraw() {
  if (typeof window.ethereum != 'undefined') {
    console.log("Withdrawing...")
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine(transactionResponse, provider)
      console.log('Done !!')
    }
    catch (error) {
      console.log(error)
    }
  }
}