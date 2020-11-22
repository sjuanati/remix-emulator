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
};

interface TokenERC20 {
    address: string,
    name: string
}

type Transfer = 'deposit' | 'withdraw';


const Home = () => {
    const user = useTypedSelector(state => state.user);
    const [_depositETH, _setDepositETH] = React.useState<string>('');
    const [_withdrawETH, _setWithdrawETH] = React.useState<string>('');
    const [_balance, _setBalance] = React.useState<string>('');
    const [_balanceOf, _setBalanceOf] = React.useState<BalanceOf>();
    const [_tokenERC20, _setTokenERC20] = React.useState<TokenERC20>();
    const [_bytes32, _setBytes32] = React.useState<string>('');

    let TokenManager: any;
    TokenManager = rawContract.abi;

    const web3js = new Web3(ganache);
    const contract = new web3js.eth.Contract(TokenManager, CONTRACT_ADDRESS.Ganache.TokenManager);

    const transferETH = (action: Transfer) => {
        if (!user.account) {
            console.log('Please connect to your Wallet');
        } else if ((!_depositETH && action === 'deposit') ||
            (!_withdrawETH && action === 'withdraw')) {
            console.log('Please insert an amount in ether');
        } else {

            const amount = (action === 'deposit') ? _depositETH : _withdrawETH
            const value = web3js.utils.toHex(web3js.utils.toWei(amount, 'ether'));

            const method = (action === 'deposit')
                ? contract.methods.depositETH().encodeABI()
                : contract.methods.withdrawETH(value).encodeABI();

            // Define parameters
            const txParams = {
                from: user.account,
                to: CONTRACT_ADDRESS.Ganache.TokenManager,
                data: method,
                value: (action === 'deposit') ? value : 0,
                chainId: user.chainId,
            };
            // Launch transaction
            metamaskTX(txParams);
        };
    };

    const registerERC20 = () => {
        if (!user.account) {
            console.log('Please connect to your Wallet');
        } else if (!_tokenERC20) {
            console.log('Please insert any token to (un)register');
        } else if (_tokenERC20 && _tokenERC20.name === '') {
            console.log('Please insert a valid address to register token');
        } else {
            const tokenName = web3js.utils.asciiToHex(_tokenERC20.name);
            const method = contract.methods.registerERC20(tokenName, _tokenERC20.address).encodeABI()

            // Define parameters
            const txParams = {
                from: user.account,
                to: CONTRACT_ADDRESS.Ganache.TokenManager,
                data: method,
                value: 0,
                chainId: user.chainId,
            };
            // Launch transaction
            metamaskTX(txParams);
        };
    };

    const unregisterERC20 = () => {
        if (!user.account) {
            console.log('Please connect to your Wallet');
        } else if (!_tokenERC20 || _tokenERC20.name === '') {
            console.log('Please insert any token to (un)register');
        } else {
            const tokenName = web3js.utils.asciiToHex(_tokenERC20.name);
            const method = contract.methods.unregisterERC20(tokenName).encodeABI()
            // Define parameters
            const txParams = {
                from: user.account,
                to: CONTRACT_ADDRESS.Ganache.TokenManager,
                data: method,
                value: 0,
                chainId: user.chainId,
            };
            // Launch transaction
            metamaskTX(txParams);
        };
    };

    const bulkRegisterERC20 = () => {
        if (!user.account) {
            console.log('Please connect to your Wallet');
        } else {
            const tokenNames = [web3js.utils.asciiToHex("DAI"), web3js.utils.asciiToHex("UNI")];
            const tokenAddresses = ["0xad6d458402f60fd3bd25163575031acdce07538d", "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"];
            const method = contract.methods.bulkRegisterERC20(tokenNames, tokenAddresses).encodeABI();

            // Define parameters
            const txParams = {
                from: user.account,
                to: CONTRACT_ADDRESS.Ganache.TokenManager,
                data: method,
                value: 0,
                chainId: user.chainId,
            };
            // Launch transaction
            metamaskTX(txParams);
        };
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
                    <button className={'grey'}>
                        bytes32 converter
                    </button>
                </div>
                <div>
                    <input
                        type="text"
                        onChange={(elem) => _setBytes32(web3js.utils.asciiToHex(elem.target.value).padEnd(66, '0'))}
                    />
                </div>
                <div className={'description'}>
                    {_bytes32}
                </div>
            </div>


            <div className={'item'}>
                <div className={'description'}>
                    <button
                        className={'red'}
                        onClick={() => transferETH('deposit')}>
                        depositETH
                    </button>
                </div>
                <div>
                    <input
                        type="number"
                        onChange={(elem) => _setDepositETH(elem.target.value)} />
                </div>
            </div>

            <div className={'item'}>
                <div className={'description'}>
                    <button
                        className={'orange'}
                        onClick={() => transferETH('withdraw')}>
                        withdrawETH
                    </button>
                </div>
                <div>
                    <input
                        type="number"
                        onChange={(elem) => _setWithdrawETH(elem.target.value)} />
                </div>
            </div>

            <div className={'item'}>
                <div className={'description'}>
                    <button
                        className={'orange'}
                        onClick={() => bulkRegisterERC20()}>
                        bulkRegisterERC20
                    </button>
                </div>
            </div>

            <div className={'item'}>
                <div className={'description'}>
                    <button
                        className={'orange'}
                        onClick={() => registerERC20()}>
                        registerERC20
                    </button>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder='name'
                        onChange={(elem) => {
                            const prev = {
                                address: (_tokenERC20) ? _tokenERC20.address : '',
                                name: elem.target.value
                            };
                            _setTokenERC20(prev);
                        }}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder='address'
                        onChange={(elem) => {
                            const prev = {
                                address: elem.target.value,
                                name: (_tokenERC20) ? _tokenERC20.name : ''
                            };
                            _setTokenERC20(prev);
                        }}
                    />
                </div>
            </div>

            <div className={'item'}>
                <div className={'description'}>
                    <button
                        className={'orange'}
                        onClick={() => unregisterERC20()}>
                        unregisterERC20
                    </button>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder='name'
                        onChange={(elem) => {
                            const prev = {
                                address: (_tokenERC20) ? _tokenERC20.address : '',
                                name: elem.target.value
                            };
                            _setTokenERC20(prev);
                        }}
                    />
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
