// Import File system library
const fs = require("fs");

// Ensure >> require("./tasks/faucet"); << is in config file

// Define the task
task("faucet", "send ETH to an address")
    .addPositionalParam("receiver", "The address that will receive ETH")
    .setAction(async ({ receiver }, { ethers }) => {
        // Check if hardhat network exists
        if (network.name === "hardhat") {
            console.warn( "Running Hardhat faucet task");
        }

        const addressesFile = __dirname + "/../frontend/src/contracts/contract-address.json";

        // Check if contract is deployed by verifying if file exists
        if (!fs.existsSync(addressesFile)) {
            console.error("Contract is not deployed. Please deploy it !");
            return;
        }
        // read file contents into addressJson variable
        const addressJson = fs.readFileSync(addressesFile);
        // parse JSON string file contents into a javascript value. address.Poll gets contract address
        const address = JSON.parse(addressJson);

        console.log(address.Poll)
        
        getCoder = await ethers.provider.getCode(address.Poll);

        // e.provider.getCode(address) gets SC code. If not deployed, result is "0x"
        if ((await ethers.provider.getCode(address.Poll)) === "0x") {
            console.log(getCoder)
            console.error("Contract is not deployed. I said deploy it damnit !");
            return;
        }

        

        // Get SC instance
        const poll = await ethers.getContractAt("Poll", address.Poll);
        // Get first signer, the contract owner
        const[sender] = await ethers.getSigners();
        console.log("Sender: " + sender);
        
        // Send user 1 ETH
        const tx = await sender.sendTransaction({
            to: receiver,
            value: ethers.constants.WeiPerEther,
        });

        await tx.wait();

        console.log(`Transferred 1 ETH to ${receiver}`);
    });