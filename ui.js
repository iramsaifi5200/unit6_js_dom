function switchView(viewId) {
    const screens = ['signup-page', 'login-page', 'dashboard'];
    screens.forEach(id => {
        const targetEl = document.getElementById(id);
        if (targetEl) {
            targetEl.style.display = 'none';
        }
    });

    const activeView = document.getElementById(viewId);
    if (activeView) {
        activeView.style.display = 'block';
    }
    clearErrors();
}

function showError(elementId, message) {
    const targetElement = document.getElementById(elementId);
    if (targetElement) {
        let errorContainer = targetElement.parentNode.querySelector('.error-message-feedback');
        if (!errorContainer) {
            errorContainer = document.createElement('small');
            errorContainer.className = 'error-message-feedback';
            targetElement.parentNode.appendChild(errorContainer);
        }
        errorContainer.textContent = message;
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message-feedback').forEach(el => el.remove());
}

function updateDashboardUI() {
    if (!window.currentUser) return;

    const nameEl = document.getElementById('display-name');
    const emailEl = document.getElementById('display-email');
    const idEl = document.getElementById('display-account-id');

    if (nameEl) nameEl.textContent = window.currentUser.name;
    if (emailEl) emailEl.textContent = window.currentUser.email;
    if (idEl) idEl.textContent = window.currentUser.accountId;

    const selectedCurrency = document.getElementById('currency-selector')?.value || 'INR';
    if (typeof updateBalanceDisplayCurrency === 'function') {
        updateBalanceDisplayCurrency(selectedCurrency);
    }

    if (typeof renderTransactions === 'function') renderTransactions();
    if (typeof calculateSummaries === 'function') calculateSummaries();
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

