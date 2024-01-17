import { Chain } from './response-types';

export type DopBalanceRefreshTrigger = (
  chain: Chain,
  dopWalletID: string,
  fullRescan: boolean,
) => Promise<void>;
