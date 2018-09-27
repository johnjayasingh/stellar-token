const {
    StellarSdk,
    token,
    server
} = require('./network');
const account = require('./account');

const _getPublicKey = secret => account.getAccount(secret).publicKey();

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

const _createToken = (issuer) => {

    const issuerPair = account.getAccount(issuer);

    // Create an object to represent the new asset
    const JohnnyDollar = new StellarSdk.Asset('JohnnyDollar', issuerPair.publicKey());
    return JohnnyDollar
}

const _addTrust = async (receiver, token) => {
    const receiverPair = account.getAccount(receiver);
    const receiverAccount = await server.loadAccount(receiverPair.publicKey());

    // The `changeTrust` operation creates (or alters) a trustline
    const transaction = new StellarSdk.TransactionBuilder(receiverAccount)
        .addOperation(StellarSdk.Operation.changeTrust({
            asset: token
        }))
        .build();
    transaction.sign(receiverPair);
    await server.submitTransaction(transaction);
}

/**
 * Send Token to receiver
 * 
 * @param {IssuerSecret} issuer 
 * @param {ReceiverPublicKey} receiver 
 * @param {TokenName} token 
 * @param {Amount} amount 
 */
const _sendToken = async (issuer, receiver, token, amount) => {
    const issuerPair = account.getAccount(issuer);

    const issuerAccount = await server.loadAccount(issuerPair.publicKey());
    const transaction = new StellarSdk.TransactionBuilder(issuerAccount)
        .addOperation(StellarSdk.Operation.payment({
            destination: receiver,
            asset: token,
            amount: `${amount}`
        }))
        .build();
    transaction.sign(issuerPair);
    return server.submitTransaction(transaction);
}

const _process = async () => {
    const issuer = 'SDYHEV2MT73EJZC6SBAXI6NV6GY3G6GHGPGQ2ER6WHSIZJBGF26ISWUN' || await _createAccount();
    console.log(`Created Issuer ${issuer}`)
    const receiver = 'SBYZJNP5QIFRINUP4IHAINTD7N3VTOOPARFR6BUREQZL3PEOQPW53QHS' || await _createAccount();
    console.log(`Created Receiver ${receiver}`)

    const token = _createToken(issuer);
    await _addTrust(receiver, token);
    await _sendToken(issuer, _getPublicKey(receiver), token, 100)


    console.log('issuer', await account.getBalance(_getPublicKey(issuer)))
    console.log('receiver', await account.getBalance(_getPublicKey(receiver)))

}

// const issuerPair = account.getAccount('SA46W4IBKX7N2DDOTFTVEH6LEFQWBYPHZDRLQS6ZWAKZEFRF2QTZQKTZ');


_process()