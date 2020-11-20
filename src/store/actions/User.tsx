import * as actionTypes from './ActionTypes';

export const setAccount = (account: string, chainId: string, web3: any) => ({
    type: actionTypes.SET_ACCOUNT,
    account: account,
    chainId: chainId,
    web3: web3,
});
