import { isDefined } from './util';

const STRING_PREFIX_AFTER_UNICODE_REPLACEMENT = 'y %';

const validAscii = (str: string) => {
  return str.replace(
    // eslint-disable-next-line no-useless-escape
    /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
    '',
  );
};

export const sanitizeError = (err: Error): Error => {
  if (isDefined(err) && err.message) {
    const lowercaseMsg = err.message.toLowerCase();
    if (
      lowercaseMsg.includes('quorum') ||
      lowercaseMsg.includes('could not connect to')
    ) {
      return new Error('Could not connect.');
    }
    if (lowercaseMsg.includes('call revert exception')) {
      return new Error('Failed to connect to RPC.');
    }
    if (lowercaseMsg.includes('missing revert data')) {
      return new Error('RPC connection error.');
    }
    if (
      lowercaseMsg.includes(
        'transaction may fail or may require manual gas limit',
      )
    ) {
      return new Error('Unknown error. Transaction failed.');
    }
    if (lowercaseMsg.includes('replacement fee too low')) {
      return new Error(
        'Nonce is used in a pending transaction, and replacement fee is too low. Please increase your network fee to replace the pending transaction.',
      );
    }
    if (lowercaseMsg.includes('intrinsic gas too low')) {
      return new Error(
        'Gas price rejected. Please select a higher gas price or resubmit.',
      );
    }
    if (lowercaseMsg.includes('transaction underpriced')) {
      return new Error(
        'Gas fee too low. Please select a higher gas price and resubmit.',
      );
    }
    if (lowercaseMsg.includes('insufficient funds for intrinsic')) {
      return new Error('Insufficient gas to process transaction.');
    }
    if (lowercaseMsg.includes('nonce has already been used')) {
      return new Error(
        // Do not change 'Nonce already used' string of Error message.
        'Nonce already used: the transaction was already completed.',
      );
    }
    if (lowercaseMsg.includes('error while dialing dial tcp')) {
      return new Error(
        'Error while connecting to RPC provider. Please try again.',
      );
    }

    // Custom DOP contract error messages
    if (lowercaseMsg.includes('dopsmartwallet')) {
      if (lowercaseMsg.includes('invalid nft note value')) {
        return new Error('DopSmartWallet: Invalid NFT Note Value.');
      }
      if (lowercaseMsg.includes('unsupported token')) {
        return new Error(
          'DopSmartWallet: Unsupported Token. This token cannot interact with the DOP contract.',
        );
      }
      if (lowercaseMsg.includes('invalid note value')) {
        return new Error(
          'DopSmartWallet: Invalid Note Value. Please submit transaction with a corrected amount.',
        );
      }
      if (lowercaseMsg.includes('invalid adapt contract as sender')) {
        return new Error(
          'DopSmartWallet: Invalid Adapt Contract as Sender. Please update your frontend to current Adapt module versions.',
        );
      }
      if (lowercaseMsg.includes('invalid merkle root')) {
        return new Error(
          'DopSmartWallet: Invalid Merkle Root. Please sync your balances and try again.',
        );
      }
      if (lowercaseMsg.includes('note already spent')) {
        return new Error(
          'DopSmartWallet: Note Already Spent. Please sync your balances and try again.',
        );
      }
      if (lowercaseMsg.includes('invalid note ciphertext array length')) {
        return new Error(
          'DopSmartWallet: Invalid Note Ciphertext Array Length. Please sync balances and re-prove your transaction.',
        );
      }
      if (lowercaseMsg.includes('invalid withdraw note')) {
        return new Error(
          'DopSmartWallet: Invalid Unshield Note. Please sync balances and re-prove your transaction.',
        );
      }
      if (lowercaseMsg.includes('invalid snark proof')) {
        return new Error(
          'DopSmartWallet: Invalid Snark Proof. Please re-prove your transaction.',
        );
      }
    }

    return new Error(
      validAscii(err.message).replace(
        `:${STRING_PREFIX_AFTER_UNICODE_REPLACEMENT}`,
        ': ',
      ),
    );
  }

  return new Error('Unknown error. Please try again.');
};
