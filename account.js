const {
    StellarSdk,
    server
} = require('./network');
var request = require('request');

module.exports = {
    createAccount: () => {
        return new Promise((resolve, reject) => {
            const pair = StellarSdk.Keypair.random();
            request.get({
                url: 'https://friendbot.stellar.org',
                qs: {
                    addr: pair.publicKey()
                },
                json: true
            }, function (error, response, body) {
                if (error || response.statusCode !== 200) {
                    reject(error || body);
                } else {
                    resolve(pair);
                    // console.log('SUCCESS! You have a new account :)\n', body);
                }
            })
        })
    },
    getAccount: publicKey => StellarSdk.Keypair.fromSecret(publicKey),
    getBalance: publicKey => // the JS SDK uses promises for most actions, such as retrieving an account
        server.loadAccount(publicKey)
        .then(function (account) {
            // console.log(account)
            return account.balances;
        })
}