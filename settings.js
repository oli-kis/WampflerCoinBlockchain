const container = document.getElementById("card__grid");
const transaction__container = document.getElementById("transaction__grid");

const apiURL = "http://localhost:8383/";

function addTransaction() {
  const amount = document.getElementById("amount").value;
  const otherWalletAddress = document.getElementById("toAddress").value;
  fetch(apiURL + "addTransaction", {
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
  fetch(apiURL + "minePendingTransactions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((data) => location.reload());
}

function changeSettings() {
  const difficulty = document.getElementById("difficulty").value;
  const reward = document.getElementById("reward").value;
  fetch(apiURL + "changeSettings", {
    method: "POST",
    body: JSON.stringify({
      difficulty: Number(difficulty),
      reward: Number(reward),
    }),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((data) => location.reload());
  alert("The settings were succesfully changed!");
}

function getAllWalletAddresses() {
  const dropdown = document.getElementById('walletDropdown');
  dropdown.innerHTML = '';
  fetch(apiURL + "getAllWalletAddresses", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((data) => {
      for (const item of data) {
        const option = document.createElement('option');
        option.textContent = item;
        dropdown.appendChild(option);
      }
    });
}


function togglePopupAddTransaction() {
  document.getElementById("popup-1").classList.toggle("active");
}
