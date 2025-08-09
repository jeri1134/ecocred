import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy ETHTransactionContract
  await deploy("ETHTransactionContract", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Deploy EcoPet contract
  await deploy("EcoPet", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default deployContracts;

deployContracts.tags = ["ETHTransactionContract", "EcoPet"];
