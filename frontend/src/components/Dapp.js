import React from "react";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import PollArtifact from "../contracts/Poll.json";
import contractAddress from "../contracts/contract-address.json";

// Import presentational HTML templates
// import { Template Function Name } from "./TemplateFile"
import { Poll } from "./Poll";
import { Voted } from "./Voted";
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { AddCandidate } from "./AddCandidate";
import { Results } from "./Results";

// Define Hardhat Network id
const HARDHAT_NETWORK_ID = '31337';

export class Dapp extends React.Component {
  constructor(props) {
    super(props);

    // Define state variables
    this.initialstate = {
      // user's address
      selectedAddress: undefined,
      networkError: undefined,
      //list of candidates on the ballot
      candidates: [],
      // Dictionary of candidate info
      candidateInformation: {},
      // Bool, whether user has votd or not
      userVoteState: undefined,
      // Who the user has voted for
      userVote: undefined,
      // When the user voted
      userVoteTime: undefined
    };
    this.state = this.initialstate;
  }

  render() {
    // Ethereum wallets inject the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install MetaMask.
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }
    
    // We check if the users metamask is connected. if not, load ConnectWallet
    if (!this.state.selectedAddress) {
      return (
        <ConnectWallet 
          connectWallet={() => this._connectWallet()} 
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
      );
    }
    
    return (
      <div className="container p-4">
        <div className="row">
          <div className="col-12">
            <h1>Election</h1>
            <p>
              Welcome <b>{this.state.selectedAddress}</b> !
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {(this.state.userVoteState) ?
              (<Voted
                userVote = {this.state.userVote}
                voteTime = {this.state.userVoteTime}
              />,
              <Results
                candidates = {this.state.candidates}
                candidateInfo = {this.state.candidateInformation}
                />
              ) : (
                <Poll
                candidates = {this.state.candidates}
                candidateInfo = {this.state.candidateInformation}
                submitVote={(candidateSelection) => 
                  this._submitVote(candidateSelection)
                }
                /> )  
          }
            {/* If user has not voted */}
              {/* Here is a list of candidates. click one then submit to cast vote */}
              {/* Call function that updates users voting state */}
            {/* If user HAS voted */}
              {/* Display who thee user voted for, and a button to */}
              {/* display current election results */}
          </div>
        </div>
        <br/>
        <br/>
        <br/>
        <br/>

        <div className="row">
          <div className="col-12">
          <AddCandidate
          newCandidate = {(candidateAddress, candidateName) => 
            this._addCandidate(candidateAddress, candidateName)
          }
          />
          </div>
        </div>
      </div>
    )
  }

  async _connectWallet() {
    console.log("Connecting wallet");
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.
  
    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
  
    // Once we have the address, we can initialize the application.
  
    // First we check the network
    if (!this._checkNetwork()) {
      return;
    }
  
    this._initialize(selectedAddress);
  
    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {

      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state 
      if (newAddress === undefined) {
        return this._resetState();
      }
      
      this._initialize(newAddress);
    });
    
    // We reset the dapp state if the network is changed
    window.ethereum.on("chainChanged", ([networkId]) => {
      this._resetState();
    });
  }

  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  // This method checks if Metamask selected network is Localhost:8545 
  _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }

    this.setState({ 
      networkError: 'Please connect Metamask to Localhost:8545'
    });

    return false;
  }

  _initialize(userAddress) {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    this.setState({
      selectedAddress: userAddress,
    });

    console.log("Current user is " + this.state.selectedAddress);

    // Initialize smart contract instance
    this._initializeEthers();
  }

  async _initializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    console.log("Web3 provider is: " + this._provider);

    // Then, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    
    console.log("")
    console.log("Web3 contract data:")
    console.log(contractAddress.Poll);
    console.log(PollArtifact.abi);
    console.log(this._provider.getSigner(0));

    console.log("Initializing Smart Contract.....")

    this._poll = new ethers.Contract(
      contractAddress.Poll,
      PollArtifact.abi,
      this._provider.getSigner(0)
    );
    console.log("Smart Contract: "  + this._poll)
    console.log(this._poll.address)

    // THESE ARE HERE BECAUSE I NEED THE CONTRACT LOADED BEFORE I UPDATE STATE VARIABLES
    // IS THERE A BETTER SPOT ???????
    // Update the users vote state
    this._getUserVoteState()

    // Update candidates list
    this._updateCandidates()
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState);
  }


  // Submit users vote
  async _submitVote(_candidate) {
    // !!!!!!!! Should I put the old await tx stuff from the boilerplate transfer.sol call ?
    // Because I am writing to blockchain, which takes time... I think I should !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    console.log("Trying to vote for " + _candidate);
    try {
      const tx = await this._poll.vote(_candidate);
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction Failed");
      }
    } catch (error) {
      console.log(error.code);
      console.error(error);
    }
    this._getUserVoteState();
    this._updateCandidates();
  }

  // Get vote state of the  user
  async _getUserVoteState() {
    var _userVoted = await this._poll.voter(this.state.selectedAddress);
    console.log("Uservoted struct: " + _userVoted);
    // var _userVoteState = await this._poll.voted(this.state.selectedAddress);
    this.setState({ userVoteState: _userVoted.voterVoteState });

    console.log(this.state.userVoteState);

    // If user has voted, update state to who they voted for
    if (this.state.userVoteState) {
      // var votedFor = await this._poll.votedFor(this.state.selectedAddress);
      await this._setStateAsync({ userVote: _userVoted.voterVoteAddress });
      await this._setStateAsync({ userVoteTime: _userVoted.voterTime });
      console.log(this.state.userVote);
      console.log(this.state.userVoteTime);
      // this.setState({ userVote: _userVoted.voterVoteAddress, 
      //                 userVoteTime: _userVoted.voterTime });
    }
  }

  // Using this was experimental. Semi for debugging. Not sure I actually need it. As of writing this, it is only used
  // twice directly. Its possible its not required, but maybe it a good hbid to use this method. That way there is no weird timing
  // issues when I use setState.
  // Use this function to employ "await" when updating state with "setState"
  _setStateAsync(state) {
    console.log("Awaiting state: " + state);
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  async _updateCandidates() {
    // Get candidates and initialize dictionary
    var currentCandidateAddresses = await this._poll.getCandidates();
    var candidateDict = {};

    // Loop through candidates and update Info dictionary
    for (var i=0; i < currentCandidateAddresses.length; i++) {
      var currentCandidate = await this._poll.candidates(currentCandidateAddresses[i]);
      var candidateInfo = {
        'name': currentCandidate.candidateName,
        'votes': Number(currentCandidate.candidateVoteCount)
      };
      candidateDict[currentCandidateAddresses[i]] = candidateInfo;  
      console.log(candidateDict[currentCandidateAddresses[i]].name + ", " + candidateDict[currentCandidateAddresses[i]].votes);
    }
    // Update state with candidates array and info dictionary
    this.setState({ candidates: currentCandidateAddresses, candidateInformation: candidateDict}, () => {
      console.log("Current candidates are " + this.state.candidates)
      console.log("Candidate Info: " + this.state.candidateInformation[this.state.candidates[0]].name + ", votes: " + this.state.candidateInformation[this.state.candidates[0]].votes)
    });
    console.log(this.state.candidateInformation[this.state.candidates[0]].votes)
  }

  async _addCandidate(_candidateAddress, _candidateName) {
    const contractOwner = await this._poll.owner();
    console.log("Contract Owner: " + contractOwner);
    console.log("Current User: " + this.state.selectedAddress);
    try {
      const tx = await this._poll.addCandidate(_candidateAddress, _candidateName);
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction Failed");
      }
    } catch (error) {
      console.log(error.code);
      console.error(error);
    }
    // await this._poll.addCandidate(_candidateAddress, _candidateName)
  }

}


