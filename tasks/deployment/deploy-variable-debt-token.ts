import { Signer } from 'ethers/lib/ethers';
import { task } from 'hardhat/config';
import { ZERO_ADDRESS } from '../../helpers/constants';
import { getDefenderRelaySigner } from '../../helpers/defender-utils';
import { verifyContract } from '../../helpers/etherscan-verification';
import { sleep } from '../../helpers/misc-utils';
import {
  IERC20Detailed__factory,
  ILendingPoolData__factory,
  VariableDebtToken__factory,
} from '../../types';

task('deploy-var-debt-token', 'Deploy AToken using prior reserve config')
  .addParam('asset')
  .addParam('underlyingName')
  .addFlag('defender')
  .setAction(
    async ({ defender, asset, underlyingName }, localBRE) => {
      await localBRE.run('set-DRE');

      let deployer: Signer;
      [deployer] = await localBRE.ethers.getSigners();

      if (defender) {
        const { signer } = await getDefenderRelaySigner();
        deployer = signer;
      }

      const pool='0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9';
      const incentivesController='0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5';
      const tokenName=`Aave variable debt bearing ${underlyingName}`
      const tokenSymbol=`variableDebt${underlyingName}`

      const { address } = await new VariableDebtToken__factory(deployer).deploy(
        pool,
        asset,
        tokenName,
        tokenSymbol,
        incentivesController
      );


      await sleep(30000);

      await verifyContract(address, [
        pool,
        asset,
        tokenName,
        tokenSymbol,
        incentivesController
      ])

      // return address;
    }
  );
