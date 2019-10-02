const Betting = artifacts.require("./Betting.sol");
const usingProvable = artifacts.require("./usingProvable.sol");
const SafeMath = artifacts.require("./SafeMath.sol");


module.exports = (deployer, network, accounts) => {
    deployer.deploy(Betting, {from: accounts[5]});
    deployer.deploy(usingProvable, {from: accounts[5]});
    deployer.deploy(SafeMath, {from: accounts[5]});
}
