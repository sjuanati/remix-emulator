const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const CONTRACT_ADDRESS = {
    "Mainnet": {
        "DAI": ZERO_ADDRESS,
        "UNI": ZERO_ADDRESS,
        "WETH": ZERO_ADDRESS,
    },
    "Ropsten": {
        "DAI": "0xad6d458402f60fd3bd25163575031acdce07538d",
        "UNI": "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
        "WETH": "0xc778417e063141139fce010982780140aa0cd5ab",
    },
    "Ganache": {
        "TokenManager": "0x7379CFbb194D78e532f4b4e3F61557bf42510Eeb",
    }
};
