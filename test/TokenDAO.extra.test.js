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


  it("5️ No se permite doble votación", async () => {
    await dao.createProposal("Propuesta Doble Voto");
    await dao.vote(1);
    await expect(dao.vote(1)).to.be.revertedWith("Ya has votado esta propuesta");
  });

  it("6️ No se puede votar sin tokens", async () => {
    await dao.createProposal("Propuesta Sin Tokens");
    await expect(dao.connect(user1).vote(1)).to.be.revertedWith("No tienes tokens para votar");
  });

  it("7️ getProposal retorna los datos correctos", async () => {
    await dao.createProposal("Datos Correctos");
    const data = await dao.getProposal(1);
    expect(data[0]).to.equal("Datos Correctos");
    expect(data[1]).to.equal(0n);
    expect(data[2]).to.equal(false);
  });

  it("8️ Las propuestas son independientes", async () => {
    await dao.createProposal("P1");
    await dao.createProposal("P2");

    await dao.vote(1);

    const p1 = await dao.proposals(1);
    const p2 = await dao.proposals(2);

    const ownerBalance = await token.balanceOf(owner.address);
    expect(p1.voteCount).to.equal(ownerBalance);
    expect(p2.voteCount).to.equal(0n);
  });

  it("9️ El peso del voto es exacto al balance", async () => {
    await token.transfer(user1.address, 500n);
    await dao.createProposal("Peso Exacto");

    await dao.connect(user1).vote(1);

    const proposal = await dao.proposals(1);
    expect(proposal.voteCount).to.equal(500n);
  });

  it("10 La votación es acumulativa", async () => {
    await token.transfer(user1.address, 100n);
    await dao.createProposal("Voto Acumulativo");

    await dao.vote(1);
    await dao.connect(user1).vote(1);

    const proposal = await dao.proposals(1);
    const totalExpected = await token.totalSupply();

    expect(proposal.voteCount).to.equal(totalExpected);
  });
});

