const StellarSdk = require('stellar-sdk')
StellarSdk.Network.useTestNetwork();
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

module.exports = {
    StellarSdk,
    server,
    token: 'MyOwnToken'
}