"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

let account1 = {
  owner: "Jonas Schmedtmann",
  movementsTypes: [
    // 's', 'as', 'asd', 'asd'
  ],
  movements: [
    // 200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300
  ],
  movementsNum: [],

  movementsDates: [
    // '2019-11-18T21:31:17.178Z',
  ],
  currency: "USD",
  locale: "en-US", // de-DE
};

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,

//   movementsDates: [
//     '2019-11-01T13:15:33.035Z',
//     '2019-11-30T09:48:16.867Z',
//     '2019-12-25T06:04:23.907Z',
//     '2020-01-25T14:18:46.235Z',
//     '2020-02-05T16:33:06.386Z',
//     '2020-04-10T14:43:26.374Z',
//     '2020-06-25T18:49:59.371Z',
//     '2020-07-26T12:01:20.894Z',
//   ],
//   currency: 'USD',
//   locale: 'en-US',
// };

// let accounts = [account1, account2];
let accounts = [account1];

/////////////////////////////////////////////////
// Elements

const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnTransfer = document.querySelector(".form__btn--transfer");
const btnDelete = document.querySelector(".form__btn--delete");
const btnDeleteAll = document.querySelector(".form__btn--deleteAll");

const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputCaseNum = document.querySelector(".form__input--case-number");

// const deleteButton = document.querySelector(".delete");
let data = {};
/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: `currency`,
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const displayTypes = acc.movementsTypes[i];

    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    account1.movementsNum[i] = i + 1;
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
              <div class="movements__date">${displayDate}</div>
            <div class="movements_types">${displayTypes}</div>
        <div class="movements__value">${formattedMov}</div>

      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);

  //
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

const getLocalStorage = () => {
  data = JSON.parse(localStorage.getItem("textInPut"));

  if (!data) {
    return;
  } else {
    account1 = data;
  }
  // console.log(data);
};

currentAccount = account1;

// Display UI and message

getLocalStorage();

updateUI(account1);
// console.log(data);

containerApp.style.opacity = 100;

// Create current date and time

const now = new Date();
const options = {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "numeric",
  year: "numeric",
  weekday: "long",
};

labelDate.textContent = new Intl.DateTimeFormat(
  currentAccount.locale,
  options
).format(now);

const setToLocalStorage = () => {
  localStorage.setItem("textInPut", JSON.stringify(account1));
};

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  // console.log(data);
  const amount = +inputTransferAmount.value;

  const value = inputTransferTo.value;

  inputTransferAmount.value = inputTransferTo.value = "";

  if (amount && inputTransferAmount != 0) {
    // Doing the transfer
    account1.movements.push(-amount);
    // receiverAcc.movements.push(amount);
    account1.movementsTypes.push(value);
    // Add transfer date
    account1.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(account1);

    setToLocalStorage();
  }
});

// getLocalStorage();
btnDelete.addEventListener("click", function (e) {
  e.preventDefault();

  const number = inputCaseNum.value - 1;
  if (Number.isInteger(number) && account1.movementsNum.includes(number + 1)) {
    account1.movements.splice(number, 1);
    account1.movementsDates.splice(number, 1);
    account1.movementsTypes.splice(number, 1);
    account1.movementsNum.splice(number, 1);
  }

  setToLocalStorage("textInPut", JSON.stringify(account1));
  updateUI(account1);

  inputCaseNum.value = "";
});

const Confirm = {
  open(options) {
    options = Object.assign(
      {},
      {
        title: "",
        message: "",
        okText: "OK",
        cancelText: "Cancel",
        onok: function () {},
        oncancel: function () {},
      },
      options
    );

    const html = `
            <div class="confirm">
                <div class="confirm__window">
                    <div class="confirm__titlebar">
                        <span class="confirm__title">${options.title}</span>
                        <button class="confirm__close">&times;</button>
                    </div>
                    <div class="confirm__content">${options.message}</div>
                    <div class="confirm__buttons">
                        <button class="confirm__button confirm__button--ok confirm__button--fill">${options.okText}</button>
                        <button class="confirm__button confirm__button--cancel">${options.cancelText}</button>
                    </div>
                </div>
            </div>
        `;

    const template = document.createElement("template");
    template.innerHTML = html;

    // Elements
    const confirmEl = template.content.querySelector(".confirm");
    const btnClose = template.content.querySelector(".confirm__close");
    const btnOk = template.content.querySelector(".confirm__button--ok");
    const btnCancel = template.content.querySelector(
      ".confirm__button--cancel"
    );

    confirmEl.addEventListener("click", (e) => {
      if (e.target === confirmEl) {
        options.oncancel();
        this._close(confirmEl);
      }
    });

    btnOk.addEventListener("click", () => {
      options.onok();
      this._close(confirmEl);
    });

    [btnCancel, btnClose].forEach((el) => {
      el.addEventListener("click", () => {
        options.oncancel();
        this._close(confirmEl);
      });
    });

    document.body.appendChild(template.content);
  },

  _close(confirmEl) {
    confirmEl.classList.add("confirm--close");

    confirmEl.addEventListener("animationend", () => {
      document.body.removeChild(confirmEl);
    });
  },
};

btnDeleteAll.addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.clear();
  Confirm.open({
    title: "Delete all",
    message: "Are you sure you wish to delete all the data?",
    onok: () => {
      account1.movementsDates = [];
      account1.movementsTypes = [];
      account1.movements = [];
      updateUI(account1);
    },
  });
});
