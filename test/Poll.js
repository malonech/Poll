// Import Chai to employ its assert functions
const { expect } = require("chai");
const { ethers } = require("hardhat");

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe ("Poll contract", function() {
    // Mocha has four functions that let you hook into the the test runner's
    // lifecycle. These are: `before`, `beforeEach`, `after`, `afterEach`.
    
    // A common pattern is to declare some variables, and assign them in the
    // `before` and `beforeEach` callbacks.
    
    let Poll;
    let hardhatPoll;
    let owner;
    let addr1;
    let addr2;
    let addr3;

    // `beforeEach` will run before each test, re-deploying the contract every
    // time. It receives a callback, which can be async.
    beforeEach(async function () {
        Poll = ethers.getContractFactory("Poll");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // To deploy our contract, we just have to call Token.deploy() and await
        // for it to be deployed(), which happens onces its transaction has been
        // mined.
        hardhatPoll = await (await Poll).deploy();
        await hardhatPoll.deployed();

    });

    // Check parameters set upon deployment of the contract
    describe("Deployment", function () {
        // `it` is another Mocha function. This is the one you use to define your
        // tests. It receives the test name, and a callback function.   
        
        // If callback function is async, Mocha will 'await' it
        it("Should set the correct owner", async function () {
            // Expect receives a value, and wraps it in an assertion objet. These
            // objects have a lot of utility methods to assert values.

            // This test expects the owner variable stored in the contract to be equal
            // to our Signer's owner.
            expect(await hardhatToken.owner()).to.equal(owner.address);
        })

        it("Should initialize with a minimum of two candidates")

    })
})