declare let window: any;

export class Transactions {

    //web3js = new Web3(new Web3.providers.HttpProvider(web3URL));

    async signedTX(
        from: string,
        to: string,
    ) {

    };

    async metamaskTX(txParams: any) {

        console.log('params: ', txParams);
        await window.ethereum.enable();

        // Transaction execution
        await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [txParams],
        })
            .then((tx: string) => {
                console.log('OK');
            })
            .catch((err: any) => {
                console.log('KO');
            });
    }

}