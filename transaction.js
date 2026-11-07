async function fetchExchangeRates(baseCurrency = 'INR') {
    try {
        const response = await fetch(`https://er-api.com{baseCurrency}`);
        if (!response.ok) throw new Error('API failed');
        const data = await response.json();
        window.currentExchangeRates = data.rates;
    } catch (error) {
        window.currentExchangeRates = { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095 };
    }
}

function updateBalanceDisplayCurrency(selectedCurrency = 'INR') {
    if (!window.currentUser) return;
    const rates = window.currentExchangeRates || { INR: 1 };
    const rate = rates[selectedCurrency] || 1;
    
    const convertedBalance = (window.currentUser.balance * rate).toFixed(2);
    const currencySymbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
    const symbol = currencySymbols[selectedCurrency] || '';
    
    const balanceEl = document.getElementById('display-balance');
    if (balanceEl) balanceEl.textContent = `${symbol}${convertedBalance}`;
}

function handleDepositAction() {
    clearErrors();
    const amountInput = document.getElementById('deposit-amount');
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        showError('deposit-amount', 'Please enter a valid positive amount.');
        return;
    }

    window.currentUser.balance += amount;
    
    const txn = {
        transactionId: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
        accountId: window.currentUser.accountId,
        type: 'deposit',
        amount: amount,
        date: new Date().toISOString()
    };

    window.allTransactions.push(txn);
    
    const userIndex = window.allUsers.findIndex(u => u.accountId === window.currentUser.accountId);
    if (userIndex !== -1) window.allUsers[userIndex].balance = window.currentUser.balance;

    if (typeof saveData === 'function') saveData();
    amountInput.value = '';
    if (typeof updateDashboardUI === 'function') updateDashboardUI();
}

function handleWithdrawalAction() {
    clearErrors();
    const amountInput = document.getElementById('withdraw-amount');
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        showError('withdraw-amount', 'Please enter a valid positive amount.');
        return;
    }

    if (amount > window.currentUser.balance) {
        showError('withdraw-amount', 'Insufficient funds available.');
        return;
    }

    window.currentUser.balance -= amount;

    const txn = {
        transactionId: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
        accountId: window.currentUser.accountId,
        type: 'withdrawal',
        amount: amount,
        date: new Date().toISOString()
    };

    window.allTransactions.push(txn);

    const userIndex = window.allUsers.findIndex(u => u.accountId === window.currentUser.accountId);
    if (userIndex !== -1) window.allUsers[userIndex].balance = window.currentUser.balance;

    if (typeof saveData === 'function') saveData();
    amountInput.value = '';
    if (typeof updateDashboardUI === 'function') updateDashboardUI();
}

function renderTransactions() {
    const listContainer = document.getElementById('transactions-list');
    if (!listContainer) return;

    const txnsList = window.allTransactions || [];
    const userTxns = txnsList.filter(t => t.accountId === window.currentUser.accountId);

    if (userTxns.length === 0) {
        listContainer.innerHTML = '<li>No transactions yet.</li>';
        return;
    }

    const formatter = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    listContainer.innerHTML = userTxns.map(t => {
        const isDeposit = t.type === 'deposit';
        const color = isDeposit ? '#2ecc71' : '#e74c3c';
        const prefix = isDeposit ? '+' : '-';
        return `
            <li style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee;">
                <div>
                    <strong>${t.type.toUpperCase()}</strong><br/>
                    <small style="color:#7f8c8d">${formatter.format(new Date(t.date))}</small>
                </div>
                <span style="color: ${color}; font-weight: bold;">${prefix} ₹${t.amount.toFixed(2)}</span>
            </li>
        `;
    }).join('');
}

function calculateSummaries() {
    const txnsList = window.allTransactions || [];
    const userTxns = txnsList.filter(t => t.accountId === window.currentUser.accountId);

    const metrics = userTxns.reduce((acc, t) => {
        if (t.type === 'deposit') acc.deposited += t.amount;
        if (t.type === 'withdrawal') acc.withdrawn += t.amount;
        return acc;
    }, { deposited: 0, withdrawn: 0 });

    const depEl = document.getElementById('summary-total-deposited');
    const withEl = document.getElementById('summary-total-withdrawn');
    const balEl = document.getElementById('summary-current-balance');

    if (depEl) depEl.textContent = `₹${metrics.deposited.toFixed(2)}`;
    if (withEl) withEl.textContent = `₹${metrics.withdrawn.toFixed(2)}`;
    if (balEl) balEl.textContent = `₹${window.currentUser.balance.toFixed(2)}`;
}


