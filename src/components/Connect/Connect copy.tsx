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

    // Show first 6 digits and last 4 digits of Ethereum address
    const showAccount = () => {
        //return user.account.slice(0, 6) + '...' + user.account.slice(-4);
        return user.account;
    };

    const updateAccount = () => {
        console.log('change!')
        web3.eth.getAccounts()
            .then(async (addr: string) => {
                // Set User account into state
                const ADDRESS = addr[0];
                const CHAIN_ID = window.ethereum.chainId;
                dispatch(setAccount(ADDRESS, CHAIN_ID, web3));
            })
            .catch((err: any) => {
                console.log('Error in Connect.tsx -> updateAccount(): Error while setting accounts: ', err);
            });
    };

    /**
     * Connect to User's wallet through an Ethereum web browser (Metamask)
     * and store the account and balance into state variables
     */
    const handleConnect = async (): Promise<any> => {
        try {
            // Ask User permission to connect to Ethereum (Metamask)
            if (window.ethereum) {
                web3 = new Web3(window.ethereum);
                await window.ethereum.enable();
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
                onClick={handleConnect}>
                {
                    (user.account === '')
                        ? <span> Connect to Ethereum </span>
                        : <span> Connected to: {showAccount()} </span>}
            </button>
        </div>
    );
};

export default Connect;