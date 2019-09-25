const Betting = artifacts.require("./Betting.sol");
const usingProvable = artifacts.require("./usingProvable.sol");
const SafeMath = artifacts.require("./SafeMath.sol");


module.exports = (deployer) => {
    deployer.deploy(Betting);
    deployer.deploy(usingProvable);
    deployer.deploy(SafeMath);
}
