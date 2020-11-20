import React from 'react';
import Web3 from 'web3';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../store/reducers/Reducer';
import { setAccount } from '../../store/actions/User';
import './Connect.css';
declare let window: any;
let web3: any;


const Connect = () => {
    const user = useTypedSelector(state => state.user);
    const dispatch = useDispatch();

    /**
     * @notice  Calls handleConnect in order to retrieve the account if the user 
     *          was already connected to Metamask (no need to press 'Connect' button)
     */
    React.useEffect(() => {
        handleConnect(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * @notice  Show first 6 digits and last 4 digits of Ethereum address
     */
    const showAccount = () => {
        return (user.account) 
            ? user.account.slice(0, 6) + '...' + user.account.slice(-4)
            : '';
    };

    /**
     * @notice  Update the account into sate
     */
    const updateAccount = () => {
        web3.eth.getAccounts()
            .then(async (addr: string) => {
                const ADDRESS = addr[0];
                const CHAIN_ID = window.ethereum.chainId;
                dispatch(setAccount(ADDRESS, CHAIN_ID, web3));
            })
            .catch((err: any) => {
                console.log('Error in Connect.tsx -> updateAccount(): Error while setting accounts: ', err);
            });
    };

    /**
     * @notice  Connect to User's wallet through an Ethereum web browser (Metamask) and
     *          remain listening for account or chainID change
     * @param   isFirstLoad If User is already connected and it is the first page load,
     *          do not ask to Connect to Metamask (window.ethereum.enable())
     */
    const handleConnect = async (isFirstLoad: boolean) => {
        try {
            // Ask User permission to connect to Ethereum (Metamask)
            if (window.ethereum) {
                web3 = new Web3(window.ethereum);
                if (!isFirstLoad) await window.ethereum.enable();
            } else if (window.web3) {
                web3 = new Web3(window.web3.currentProvider);
            } else {
                window.alert('Non-Ethereum browser detected. Please install MetaMask plugin');
                return;
            };
  
            // Update account
            updateAccount();

            // Listen for account change in Ethereum browser
            window.ethereum.on('accountsChanged', (addr: string) => {
                if (addr.length > 0) {
                    updateAccount();
                } else {
                    // User disconnects from the web
                    dispatch(setAccount('', '', null));
                };
            });

            // Listen for chain change in Ethereum browser
            window.ethereum.on('chainChanged', (chainId: string) => {
                updateAccount();
            });

        } catch (err) {
            console.log('Error in Connect.tsx -> handleConnect(): ', err);
        };
    };

    return (
        <div>
            <button
                className={'dark_blue'}
                onClick={() => handleConnect(false)}>
                {
                    (user.account === '')
                        ? <span> Connect to Ethereum </span>
                        : <span> Connected to: {showAccount()} </span>}
            </button>
        </div>
    );
};

export default Connect;