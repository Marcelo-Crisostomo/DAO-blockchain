const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Testing adicional Token + DAO", function () {
  let token;
  let dao;
  let owner;
  let user1;

  beforeEach(async () => {
    [owner, user1] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("GovernanceToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    const DAO = await ethers.getContractFactory("SimpleDAO");
    // Deployment expects token address
    dao = await DAO.deploy(await token.getAddress());
    await dao.waitForDeployment();
  });

  it("1️ El deployer recibe el total del supply", async () => {
    const totalSupply = await token.totalSupply();
    const ownerBalance = await token.balanceOf(owner.address);
    expect(ownerBalance).to.equal(totalSupply);
  });

  it("2️ Se pueden transferir tokens", async () => {
    await token.transfer(user1.address, 100n);
    const balance = await token.balanceOf(user1.address);
    expect(balance).to.equal(100n);
  });

  it("3️ Se puede crear una propuesta en el DAO", async () => {
    await dao.createProposal("Propuesta de prueba");
    // Proposal ID starts at 1
    const proposal = await dao.proposals(1);
    expect(proposal.description).to.equal("Propuesta de prueba");
  });

  it("4️ Se puede votar una propuesta", async () => {
    await dao.createProposal("Votar propuesta");

    // Vote needs only proposalId (1), boolean was removed in contract logic shown earlier or not needed if vote() only takes ID?
    // Checking SimpleDAO.sol: function vote(uint256 _proposalId) external
    // It does not take a boolean. It just registers the vote.
    // Also proposal ID is 1.
    await dao.vote(1);

    const proposal = await dao.proposals(1);
    // proposal has: description, voteCount, executed.
    // We need to check voteCount.
    // Owner has all tokens initially (1000000 * 10^18).
    // Vote adds balance to voteCount.

    const ownerBalance = await token.balanceOf(owner.address);
    expect(proposal.voteCount).to.equal(ownerBalance);
  });
});
