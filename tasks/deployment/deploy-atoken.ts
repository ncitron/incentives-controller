import { Signer } from 'ethers';
import { task } from 'hardhat/config';
import { ZERO_ADDRESS } from '../../helpers/constants';
import { getDefenderRelaySigner } from '../../helpers/defender-utils';
import { ILendingPoolData__factory, IERC20Detailed__factory, AToken__factory } from '../../types';
import { verifyContract, checkVerification } from '../../helpers/etherscan-verification';
import { sleep } from '../../helpers/misc-utils';

task('deploy-atoken', 'Deploy AToken using prior reserve config')
  .addParam('asset')
  .addParam('underlyingName')
  .addFlag('defender')
  .setAction(
    async (
      { defender, asset, underlyingName },
      localBRE
    ) => {
      await localBRE.run('set-DRE');

      let deployer: Signer;
      [deployer] = await localBRE.ethers.getSigners();

      if (defender) {
        const { signer } = await getDefenderRelaySigner();
        deployer = signer;
      }

      // const { aTokenAddress } = await ILendingPoolData__factory.connect(
      //   pool,
      //   deployer
      // ).getReserveData(asset);

      // if (!tokenSymbol && aTokenAddress === ZERO_ADDRESS) {
      //   throw new Error(
      //     "Reserve does not exists or not initialized. Pass 'tokenSymbol' as param to the task.'"
      //   );
      // }
      // if (!tokenName && aTokenAddress === ZERO_ADDRESS) {
      //   throw new Error(
      //     "Reserve does not exists or not initialized. Pass 'tokenName' as param to the task.'"
      //   );
      // }

      // // Grab same name and symbol from old implementation
      // if (!tokenName) {
      //   tokenName = await IERC20Detailed__factory.connect(aTokenAddress, deployer).name();
      // }
      // if (!tokenSymbol) {
      //   tokenSymbol = await IERC20Detailed__factory.connect(aTokenAddress, deployer).symbol();
      // }

      // console.log(pool)

      const pool='0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9';
      const treasury='0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c';
      const incentivesController='0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5';
      const tokenName=`Aave interest bearing ${underlyingName}`
      const tokenSymbol=`a${underlyingName}`


      // const { address } = await new AToken__factory(deployer).deploy(
      //   pool,
      //   asset,
      //   treasury,
      //   tokenName,
      //   tokenSymbol,
      //   incentivesController
      // );

      // await sleep(30000);

      await verifyContract("0xd78037ED778ec3E2FCDb03B622c42d2F1B66D469", [
        pool,
        asset,
        treasury,
        tokenName,
        tokenSymbol,
        incentivesController
      ])

      // return address;
    }
  );
