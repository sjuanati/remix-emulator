import { createSelectorHook } from 'react-redux';

export interface RootState {
    user: {
        account: string;
        chainId: string;
        web3: any;
    }
};

//export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useTypedSelector = createSelectorHook<RootState>();

