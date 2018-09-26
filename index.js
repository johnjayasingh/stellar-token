var StellarSdk = require('stellar-sdk')
StellarSdk.Network.useTestNetwork();
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

var pair = StellarSdk.Keypair.random();

pair.secret();
// SAV76USXIJOBMEQXPANUOQM6F5LIOTLPDIDVRJBFFE2MDJXG24TAPUU7
pair.publicKey();
// GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4YH5O5JT3YZXCYPAFBJZB

var request = require('request');
request.get({
    url: 'https://friendbot.stellar.org',
    qs: {
        addr: pair.publicKey()
    },
    json: true
}, function (error, response, body) {
    if (error || response.statusCode !== 200) {
        console.error('CREATE ACCOUNT ERROR!', error || body);
    } else {
        console.log('SUCCESS! You have a new account :)\n', body);

        var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

        // the JS SDK uses promises for most actions, such as retrieving an account
        server.loadAccount(pair.publicKey()).then(function (account) {
            console.log('Balances for account: ' + pair.publicKey());
            account.balances.forEach(function (balance) {
                console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
            });
        });
    }
});



// addPreAuthSigner(pair.secret())