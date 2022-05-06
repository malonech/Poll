// This script deploys the smart contract in the Hardhat environement

import pkg from '../Arguments/initialCandidates.js';
const { initialCandidateAddresses, initialCandidateNames } = pkg;


async function main() {
  // For fun, we get contract deployer, then display it
  const [deployer] = await ethers.getSigners();
  // a Signer is an abstraction of an Eth account, which is use to 
  // sign messages and transactions to the Eth Network to execute
  // State changing operations. signer.getAddress returns promise to 
  // accounts address.
  console.log("Deploying smart contract with account: " 
  + await deployer.getAddress()
  );
  // the Contract Factory sends a initcode transaction wheree init code 
  // is evaluated and result is new code to be deployed as a new contract
  const Poll = await ethers.getContractFactory("Poll");
  console.log(initialCandidateAddresses);
  console.log(initialCandidateNames);
  const poll = await Poll.deploy(initialCandidateAddresses, initialCandidateNames);

  console.log(poll.address)

  const check = await poll.deployed() 
  if (check) {
    console.log("deployed: " + check);  
  }

  // Finally, we save the contracts artifacts and address in the frontend directory
  saveFrontendFiles(poll);
}

/* 
  The FS module of Node.js implements I/O file operations. Methods can be
  asynchronous (ex: mkdir) and synchronous (ex: mkdirSync). Aynchronous 
  features a callback function which indicates completion of the asynchrnous 
  function. Asynchrnous is preferred as it never blocks a program during its 
  excecution. Synchrnous should only be used  for debugging.
*/

function saveFrontendFiles(poll) {
  // Import the File System library
  const fs = require("fs")
  // Get frontend contract directory address
  const contractsDir = __dirname + "/../frontend/src/contracts";

  // Check to see if the frontend contracts directory exists. If not, make it
  // Asynchronous fs.exists is deprecated. fs.existsSync is recommended.
  if (!fs.existsSync(contractsDir)) {
    //mkdirSync creates dir synchronously. mkdir makes it asynchronously
    fs.mkdirSync(contractsDir);
  }

  // Wrte contract address file. fs.writeFile(file, data, options, callback)
  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    // JSON.stringify converts JS object/value to a JSON string.
    // JSON.stringify(value, replacer (optional), space)
    JSON.stringify({ Poll: poll.address }, undefined, 2)
  );

  const PollArtifact = artifacts.readArtifactSync("Poll");

  fs.writeFileSync(
    contractsDir + "/Poll.json",
    JSON.stringify(PollArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })

/* 
    From what I gather, this last chunk of code is the "main" script
    that calls the 'main' function. The 'main' function then calls the 
    'saveFrontendFiles' function. The functions would not be called 
    otherwise.

    .then() is run after the  functions are carried out. process.exit(0)
    just means exit with status code 0, which indicates no async operations
    are pending. Other numbers signifiy other error codes.

    .catch will catch errors associated with the async operations. Here
    we console.log the error, and then exit with error code 1. Error code 1
    is an "uncaught fatal exception"
  */