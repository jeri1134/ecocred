import type { HardhatRuntimeEnvironment } from "hardhat/types";
import type { DeployFunction } from "hardhat-deploy/types";

const deployEcoCred: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;

  console.log("Deploying EcoCred contract...");

  // Get the deployed EcoPet contract address
  const ecoPetDeployment = await get("EcoPet");
  console.log(`Using EcoPet contract at: ${ecoPetDeployment.address}`);

  const ecoCredDeployment = await deploy("EcoCred", {
    from: deployer,
    args: [ecoPetDeployment.address],
    log: true,
    autoMine: true,
  });

  console.log(`EcoCred deployed to: ${ecoCredDeployment.address}`);
};

export default deployEcoCred;
deployEcoCred.tags = ["EcoCred"];
deployEcoCred.dependencies = ["EcoPet"];
