import { ethers } from "hardhat";
const name = "OpenAiSimpleLLM";
let i  = 0;
const br = () => {
  console.log(`#br ${i++}`);
}

(async () => {
  try {
    br();
    if (!process.env.ORACLE_ADDRESS) {
      throw new Error("ORACLE_ADDRESS env variable is not set.");
    }
    br();
    const oracleAddress: string = process.env.ORACLE_ADDRESS;
    br();
    const agent = await ethers.deployContract(name, [oracleAddress], {});
    br();
    await agent.waitForDeployment();
    br();
    console.log(`${name} contract deployed to ${agent.target}`);
  } catch (e) {
    console.error("ERROR: ", e);
    process.exit(1);
  }
})();
// async function main() {
//   if (!process.env.ORACLE_ADDRESS) {
//     throw new Error("ORACLE_ADDRESS env variable is not set.");
//   }
//   const oracleAddress: string = process.env.ORACLE_ADDRESS;
//   console.log("#br0");
//   try {
//     await deployContractByName(oracleAddress, "OpenAiSimpleLLM");
//   } catch (error) {
//     console.error("Error deploying contract:", error);
//   }
//   console.log("#br1");
// }

// async function deployContractByName(oracleAddress: string, name: string) {
//   const agent = await ethers.deployContract(name, [oracleAddress], {});

//   await agent.waitForDeployment();

//   console.log(`${name} contract deployed to ${agent.target}`);

// }

// (async () => {
//   await main().catch(e => {
//   console.error(e);
//   process.exitCode = 1;
//   })
// })();
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });