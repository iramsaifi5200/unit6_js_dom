window.allUsers = [];
window.allTransactions = [];
window.currentUser = null;
window.currentExchangeRates = { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095 };

document.addEventListener('DOMContentLoaded', async () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    loadData();

    if (typeof fetchExchangeRates === 'function') {
        await fetchExchangeRates('INR');
    }

    const activeAccountId = localStorage.getItem('bank_active_user');
    if (activeAccountId) {
        const foundUser = window.allUsers.find(u => u.accountId === activeAccountId);
        if (foundUser) {
            window.currentUser = foundUser;
            if (typeof updateDashboardUI === 'function') updateDashboardUI();
            if (typeof switchView === 'function') switchView('dashboard');
        } else {
            localStorage.removeItem('bank_active_user');
            if (typeof switchView === 'function') switchView('signup-page');
        }
    } else {
        if (typeof switchView === 'function') switchView('signup-page');
    }

    setupEventHandlers();
});

function setupEventHandlers() {
    document.getElementById('signup-form')?.addEventListener('submit', (e) => handleSignUpSubmit(e));
    document.getElementById('login-form')?.addEventListener('submit', (e) => handleLoginSubmit(e));
    document.getElementById('deposit-btn')?.addEventListener('click', () => handleDepositAction());
    document.getElementById('withdraw-btn')?.addEventListener('click', () => handleWithdrawalAction());
    document.getElementById('close-account-btn')?.addEventListener('click', () => handleLogOutAction());
    document.getElementById('theme-toggle-btn')?.addEventListener('click', () => toggleTheme());

    document.getElementById('currency-selector')?.addEventListener('change', (e) => {
        if (typeof updateBalanceDisplayCurrency === 'function') {
            updateBalanceDisplayCurrency(e.target.value);
        }
    });
}

function saveData() {
    localStorage.setItem('bank_users', JSON.stringify(window.allUsers));
    localStorage.setItem('bank_transactions', JSON.stringify(window.allTransactions));
}

function loadData() {
    const rawUsers = localStorage.getItem('bank_users');
    const rawTxns = localStorage.getItem('bank_transactions');
    window.allUsers = rawUsers ? JSON.parse(rawUsers) : [];
    window.allTransactions = rawTxns ? JSON.parse(rawTxns) : [];
}



