require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/s69rZBXdPqLsTvn900hkwoM_sq7JfO8v',
      accounts: ['1857be1c9afa96c60d2c3168cec0f109528b14378e8526813af89c2a9581e52c'],
    },
  },
};