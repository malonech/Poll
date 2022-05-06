// This file defines the initial candidates to be considered
// in the poll. These arrays will be imported to deploy.js, 
// which will pass them into the Poll.sol constructor

// Import web3 so we can convert strings to bytes32
var web3 = require("web3");

// Define Initial candidate addresses
const initialCandidateAddresses = [
    "0xFE7B2887B60bF530c76675c7C1055Ab7bcA6D0A1",
    "0x94B6f3978B0A32f7Fa0B15243E86af1aEc23Deb5",
    "0xD8386e7d5E989EFc9B4409031CF2cc138d140BC0"
];

// Define initial candidate names
const initialCandidateNames = [
    web3.eth.abi.encodeParameter('bytes32', "Huey"),
    web3.utils.fromAscii("Duey"),
    web3.utils.fromAscii("Louie"),
];

// Export variables
exports.initialCandidateAddresses = initialCandidateAddresses;
exports.initialCandidateNames = initialCandidateNames;
