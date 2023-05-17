const container = document.getElementById("card__grid");
const transaction__container = document.getElementById("transaction__grid");
const apiURL = "http://localhost:8383/";

const fetchOptions = {
  method: "GET",
  headers: {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};

async function getChain() {
  const response = await fetch(apiURL, fetchOptions);
  const json = await response.json();
  return json.chain;
}

async function displayChain() {
  const chain = await getChain();
  let i = 0;
  let blockTitle;
  let html = "";
  chain.forEach((element) => {
    if (i == 0) {
      blockTitle = "Genesis Block";
    } else {
      blockTitle = "Block " + i;
    }
    html += `<div class="grid__item">
      <div class="title">${blockTitle}</div>
      <div class="space__line"></div>
      <div class="hash__container">
        <span class="hash__title">Hash</span> <br />
        <span class="hash__code">${ReturnShortString(
          element.hash
        )}</span> <div class="space__line"></div>
        <span class="previousHash__title">Hash of previous Block</span><br />
        <span class="previousHash__code">${ReturnShortString(
          element.previousHash
        )}</span>
        <div class="space__line"></div>
      </div>
      <div class="nonce">
        <span class="nonce__title">Nonce</span><br />
        <span class="nonce__code">${element.nonce}</span>
      </div>
      <div class="space__line"></div>
      <div class="timestamp">
        <span class="timestamp__title">Timestamp</span> <br />
        <span class="timestamp__code">${element.timestamp}</span>
      </div>
    </div>`;
    i++;
  });
  container.innerHTML = html;
}

async function displayTransactions() {
  const chain = await getChain();
  let html = "";
  let i = 0;
  for (const block of chain) {
    const table = document.createElement("table");
    table.id = "transaction__table";
    html += `<div class="transaction__title">${
      i === 0 ? "Genesis Block" : "Block " + i
    }</div>`;
    transaction__container.append(table);
    if (block.transactions == "Genesis Block") {
      table.innerHTML += `<span class="genesisBlockTransactions">No Transactions<span>`;
    } else {
      table.innerHTML += `<tr>
        <th>#</th>
        <th>From Address</th>
        <th>To Address</th>
        <th>Amount</th>
        <th>Signature</th>
      </tr>`;
    }

    if (Array.isArray(block.transactions)) {
      let txNumber = 0;
      for (const transaction of block.transactions) {

        txNumber++;
        table.innerHTML += `<tr>
          <td>${txNumber}</td>
          <td>${ReturnShortString10(transaction.fromAddress)}</td>
          <td>${ReturnShortString10(transaction.toAddress)}</td>
          <td>${transaction.amount}</td>
          <td>${ReturnShortString10(transaction.signature)}</td>
        </tr>`;
      }
    }
    i++;
  }
}

displayChain();
displayTransactions();


function ReturnShortString(str) {
  if (str.length > 0 && str.length < 30) {
    return str;
  } else if (str == null) {
    return "System";
  } else {
    return str.slice(0, 30) + "...";
  }
}

function ReturnShortString10(str) {
  if (str == null) {
    return "System";
  } else if (str.length > 0 && str.length < 20) {
    return str;
  } else {
    return str.slice(0, 20) + "...";
  }
}

function addTransaction() {
  const amount = document.getElementById("amount").value;
  const otherWalletAddress = document.getElementById("toAddress").value;
  fetch( apiURL + "addTransaction", {
    method: "POST",
    body: JSON.stringify({
      amount: amount,
      otherWalletAddress: otherWalletAddress,
    }),
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.text())
    .then((data) => {
      togglePopupAddTransaction();
    });
  alert("Transaction was added, you can now mine the pending transactions!");
}

function minePendingTransactions() {
  fetch( apiURL + "minePendingTransactions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((data) => location.reload());
}

function getBalanceOfWallet() {
  const walletAddress = document.getElementById("walletAddress").value;
  fetch(apiURL + "getBalance?walletAddress=" + walletAddress, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((data) => displayBalance(walletAddress, data));
}


function displayBalance(walletAddress, walletBalance){
  const h1 = document.getElementById("displayBalance");
  h1.textContent = `Balance of Wallet Address ${walletAddress.slice(0, 8)}... is ${walletBalance} Coins`
}

function togglePopupAddTransaction() {
  document.getElementById("popup-1").classList.toggle("active");
}

function togglePopupGetBalance() {
  document.getElementById("popup-2").classList.toggle("active");
}