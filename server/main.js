const { Blockchain, Transaction } = require("./blockchain");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
const express = require("express");
const app = express();
const port = 8383;
const bodyParser = require("body-parser");

const myKey = ec.keyFromPrivate(
  "51c1df67d0a70d3f6c94b3c168349bcef6d6b047a01595e6aa5667d41f595e1a"
);
const myWalletAddress = myKey.getPublic("hex");

let wampflerCoin = new Blockchain();



for (let index = 0; index < 3; index++) {
  const tx = new Transaction(myWalletAddress, "OtherWalletAddress", 10);
  tx.signTransaction(myKey);
  wampflerCoin.addTransaction(tx);
  console.log("\n Starting miner");
  wampflerCoin.minePendingTransactions(myWalletAddress);
}

console.log("Is chain valid? ", wampflerCoin.isChainValid());
console.log(myWalletAddress);

app.use(bodyParser.json());
app.use(express.static("public"));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Origin"
  );
  next();
});

app.get("/", (req, res) => {
  res.send(wampflerCoin);
});

app.get("/getAllWalletAddresses", (req, res) => {
  const wallets = wampflerCoin.getAllWalletAddresses();
  res.send(wallets);
});

app.post("/addTransaction", (req, res) => {
  // Create a new transaction object and sign it
  const tx1 = new Transaction(
    myWalletAddress,
    req.body.otherWalletAddress,
    req.body.amount
  );
  tx1.signTransaction(myKey);

  // Add the transaction to the blockchain
  wampflerCoin.addTransaction(tx1);

  // Return a response to the client
  res.send("Transaction added to the blockchain");
});


app.post("/minePendingTransactions", (req, res) => {
  if (wampflerCoin.pendingTransactions.length == 0) {
    res.send("There are no pending transactions");
  } else {
    // Mine pending transactions
    wampflerCoin.minePendingTransactions(myWalletAddress);

    // Return a response to the client
    res.send("Pending transactions mined");
  }
});

app.post("/changeSettings", (req, res) => {
  wampflerCoin.difficulty = req.body.difficulty;
  wampflerCoin.miningReward = req.body.reward;
  res.send("Settings changed");
});

app.get("/getBalance", (req, res) => {
  const balance = wampflerCoin.getBalanceOfAddress(req.query.walletAddress);
  res.send(balance.toString());
});



app.listen(port, () => console.log("Server started"));
