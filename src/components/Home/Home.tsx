import React from 'react';
import Web3 from 'web3';
import Connect from '../Connect/Connect';
import { useTypedSelector } from '../../store/reducers/Reducer';
import rawContract from '../../contracts/TokenManager.json';
import { infura, ganache } from '../Utils/Providers';
import { CONTRACT_ADDRESS } from '../Utils/Contracts';
import { Transactions } from '../Utils/Transactions';
import './Home.css';

declare let window: any;

interface BalanceOf {
    address: string,
    amount: string,
}

const Home = () => {
    const user = useTypedSelector(state => state.user);
    const [amountETH, setAmountETH] = React.useState<string>('');
    const [_balance, _setBalance] = React.useState<string>('');
    const [_balanceOf, _setBalanceOf] = React.useState<BalanceOf>();

    let TokenManager: any;
    TokenManager = rawContract.abi;

    const web3js = new Web3(ganache);
    const contract = new web3js.eth.Contract(TokenManager, CONTRACT_ADDRESS.Ganache.TokenManager);


    const handleDepositETH = () => {
        if (!user.account) {
            console.log('Please connect to your Wallet');
        } else if (!amountETH) {
            console.log('Please insert an amount in ether');
        } else {
            // Define parameters
            const txParams = {
                from: user.account,
                to: CONTRACT_ADDRESS.Ganache.TokenManager,
                data: contract.methods.depositETH().encodeABI(),
                value: web3js.utils.toHex(web3js.utils.toWei(amountETH, 'ether')),
                chainId: user.chainId,
            };
            // Launch transaction
            metamaskTX(txParams);
        };
    };

    const handleRenounceOwnership = () => {
        console.log('user: ', user)
    };

    const transferOwnership = () => {

    };

    const contractAddressERC20 = () => {

    };

    const contractAddressERC721 = () => {

    };

    const balanceOf = () => {
        if (_balanceOf && _balanceOf.address.length === 42) {
        contract.methods.balanceOf(_balanceOf.address).call()
            .then((res: string) => {
                _setBalanceOf({
                    address: _balanceOf.address,
                    amount: web3js.utils.fromWei(res, 'ether')
                });
            })
            .catch((err: string) => {
                console.log('Error in Home->balanceOf(): ', err);
            });
        } else {
            console.log('Please input a valid address');
        };
    };

    const balance = () => {
        web3js.eth.getBalance(CONTRACT_ADDRESS.Ganache.TokenManager)
            .then(balance => {
                _setBalance(web3js.utils.fromWei(balance));
            })
            .catch(err => {
                console.log('Error while retrieving contract balance: ', err);
            })
    };

    const metamaskTX = async (txParams: any) => {

        // Transaction execution
        await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [txParams],
        })
            .then((tx: string) => {
                console.log('OK:', tx);
            })
            .catch((err: any) => {
                console.log('KO:', err);
            });
    };

    return (
        <div className={'container'}>
            <div className={'wallet'}>
                <Connect />
            </div>

            <div className={'item'}>
                <div className={'description'}>
                    <button className={'grey'}>
                        Contract
                    </button>
                </div>
                <div>
                    {CONTRACT_ADDRESS.Ganache.TokenManager}
                </div>
            </div>


            <div className={'item'}>
                <div className={'description'}>
                    <button
                        className={'red'}
                        onClick={handleDepositETH}>
                        depositETH
                    </button>
                </div>
                <div>
                    <input
                        type="number"
                        onChange={(elem) => setAmountETH(elem.target.value)} />
                </div>
            </div>

            <div className={'item'}>
                <div className={'description'}>
                    <button className={'orange'}> Balance </button>
                </div>
                <div>
                    Whatever
                </div>
            </div>

            <div className={'item'}>
                <div className={'description'}>
                    <button
                        className={'blue'}
                        onClick={balanceOf}>
                        balanceOf
                    </button>
                </div>
                <input
                        type="text"
                        onChange={(elem) => 
                            _setBalanceOf({
                                address: elem.target.value,
                                amount: '',
                            })
                        } />
                <div className={'description'}>
                    {_balanceOf?.amount}
                </div>
            </div>

            <div className={'item'}>
                <div className={'description'}>
                    <button
                        className={'blue'}
                        onClick={balance}>
                        balance
                    </button>
                </div>
                <div>
                    {_balance}
                </div>
            </div>

        </div>
    );
};

export default Home;
