//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.0;

// import console for console.logs functionality
import "hardhat/console.sol";

contract Poll {
    // Initialize Global Variables

    // Initialize voter struct
    struct Voter {
        // Not including voter addres as this will be the mapping (voteAddr => Voter(struct))
        // address voterAddress;
        address voterVoteAddress;
        uint voterTime;
        bool voterVoteState; // DONT think I need this, because if the struct doesnt exists then they havnt voted. If it does, they have.
    }

    // Initialize candidate struct
    struct Candidate {
        //NOT including address as this will be the mapping (candAddr => candidate(struct))
        // address candidateAddress;
        string candidateName;
        uint candidateVoteCount;
    }

    mapping(address => Voter) public voter;

    mapping(address => Candidate) public candidates;

    // Initialize array to store candidate adresses
    address[] public candidatesList;

    // An address type variable is used to store ethereum accounts.
    address public owner;

    constructor(address[] memory initialCandidateAddresses, bytes32[] memory initialCandidateNames) {
        owner = msg.sender;
        for(uint i=0;i<initialCandidateAddresses.length;i++) {
            addCandidate(initialCandidateAddresses[i], string(abi.encodePacked(initialCandidateNames[i])));
        }

        // SHOULD CHANGE THIS TO HAVE INPUT PARAMETERS TO A MINIMUM OF TWO CANDIDATES
        // addCandidate(0xFE7B2887B60bF530c76675c7C1055Ab7bcA6D0A1, "Huey");
        // addCandidate(0x94B6f3978B0A32f7Fa0B15243E86af1aEc23Deb5, "Duey");
        // addCandidate(0xD8386e7d5E989EFc9B4409031CF2cc138d140BC0, "Luey");
    }

    modifier uniqueVoter {
        // Check if the voter has already
        require(voter[msg.sender].voterVoteAddress == address(0), "This user address has already voted!");
        _;
    }

    modifier onlyOwner {
        // Ensure only the owner can use the function
        require(msg.sender == owner, "Only the contract owner can employ this function!");
        _;
    }

    function addCandidate(address _newCandidate, string memory _newCandidateName) public onlyOwner {
        
        require(bytes(candidates[_newCandidate].candidateName).length == 0, "Candidate is already in the running!");

        // Add candidate to candidates mapping, creating struct element
        candidates[_newCandidate] = Candidate(_newCandidateName, 0);
        
        // // Update mapping to store candidates name
        // candidateNames[_newCandidate] = _newCandidateName;
        // // Add candidate to valid candidates list (via true)
        // candidateCheck[_newCandidate] = true;

        // Add candidate to list of candidates.
        candidatesList.push(_newCandidate);
    }

    function vote(address _candidate) external uniqueVoter {
        // Ensure the _candidate is a valid candidate
        require(bytes(candidates[_candidate].candidateName).length != 0, "This candidate does not exist");

        voter[msg.sender].voterVoteAddress = _candidate;
        voter[msg.sender].voterTime = block.timestamp;
        voter[msg.sender].voterVoteState = true;
        candidates[_candidate].candidateVoteCount += 1;
    }

    function results() view public returns(address) {
        address current_leader;
        for (uint i=0; i < candidatesList.length; i++) {
            if (i == 0) {
                current_leader = candidatesList[i];
            }
            if (candidates[candidatesList[i]].candidateVoteCount > candidates[current_leader].candidateVoteCount) {
                current_leader = candidatesList[i];
            }
        }
        return current_leader;
    }

    // Need function to return full candidates array
    function getCandidates() view public returns(address[] memory) {
        return(candidatesList);
    }
}