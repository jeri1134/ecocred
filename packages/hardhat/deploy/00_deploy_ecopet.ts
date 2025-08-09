import type { HardhatRuntimeEnvironment } from "hardhat/types";
import type { DeployFunction } from "hardhat-deploy/types";

const deployEcoPet: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("Deploying EcoPet contract...");

  const ecoPetDeployment = await deploy("EcoPet", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  console.log(`EcoPet deployed to: ${ecoPetDeployment.address}`);
};

export default deployEcoPet;
deployEcoPet.tags = ["EcoPet"];
