import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['user'];
interface State extends rootState { };
interface Action extends rootState {
    type: string,
};

const initialState = {
    account: '',
    chainId: '',
    web3: null,
};

const setAccount = (state: State, action: Action) => {
    return {
        ...state,
        ...{
            account: action.account,
            chainId: action.chainId,
        }
    };
};

const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_ACCOUNT:
            return setAccount(state, action);
        default: return state;
    }
};

export default reducer;
