const {
    StellarSdk,
    token,
    server
} = require('./network');
const account = require('./account');

const _createAccount = () => {
    let pair
    return account
        .createAccount()
        .then((_pair) => {
            pair = _pair;
            return account
                .getBalance(pair.publicKey())
        })
        .then(balances => {
            console.log(balances);
            return pair.secret();
        })
}

const _createToken = async (issuer, receiver) => {

    const receiverPair = account.getAccount(receiver);
    const issuerPair = account.getAccount(issuer);

    // Create an object to represent the new asset
    const JohnnyDollar = new StellarSdk.Asset('JohnnyDollar', issuerPair.publicKey());
    const receiverAccount = await server.loadAccount(receiverPair.publicKey());
    const transaction = new StellarSdk.TransactionBuilder(receiverAccount)
        // The `changeTrust` operation creates (or alters) a trustline
        .addOperation(StellarSdk.Operation.changeTrust({
            asset: JohnnyDollar
        }))
        .build();
    transaction.sign(receiverPair);
    await server.submitTransaction(transaction);
}

// const issuer = await _createAccount();
// console.log(`Created Issuer ${issuer}`)
// const receiver = await _createAccount();
// console.log(`Created Receiver ${receiver}`)
// _createToken('SAPSLKZES66AIGAMVCDXGQT4SGGTT5GULS7H32CLHFWYWSPHUVLUPP75', 'SA46W4IBKX7N2DDOTFTVEH6LEFQWBYPHZDRLQS6ZWAKZEFRF2QTZQKTZ');
const issuerPair = account.getAccount('SA46W4IBKX7N2DDOTFTVEH6LEFQWBYPHZDRLQS6ZWAKZEFRF2QTZQKTZ');
account.getBalance(issuerPair.publicKey()).then(balances=>{
    console.log(balances)
})