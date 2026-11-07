function handleSignUpSubmit(e) {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('signup-name').value.trim();
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    let valid = true;

    if (!name) { showError('signup-name', 'Full name is required.'); valid = false; }
    if (!username) { showError('signup-username', 'Username is required.'); valid = false; }
    if (!email) { showError('signup-email', 'Email Address is required.'); valid = false; }
    if (!password) { showError('signup-password', 'Password is required.'); valid = false; }
    
    if (password !== confirmPassword) {
        showError('signup-confirm-password', 'Passwords do not match.');
        valid = false;
    }

    const usersList = window.allUsers || [];

    if (usersList.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        showError('signup-email', 'Email already registered.');
        valid = false;
    }

    if (usersList.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        showError('signup-username', 'Username is already taken.');
        valid = false;
    }

    if (!valid) return;

    const newUser = {
        accountId: `ACC-${Math.floor(1000 + Math.random() * 9000)}`,
        name,
        username,
        email,
        password,
        balance: 0
    };

    window.allUsers.push(newUser);
    if (typeof saveData === 'function') saveData();
    e.target.reset();
    switchView('login-page');
}

function handleLoginSubmit(e) {
    e.preventDefault();
    clearErrors();

    const identity = document.getElementById('login-email').value.trim();
    const secret = document.getElementById('login-password').value;

    const usersList = window.allUsers || [];

    const matchedUser = usersList.find(u => 
        (u.email.toLowerCase() === identity.toLowerCase() || u.username.toLowerCase() === identity.toLowerCase()) && u.password === secret
    );

    if (matchedUser) {
        window.currentUser = matchedUser;
        localStorage.setItem('bank_active_user', matchedUser.accountId); 
        if (typeof updateDashboardUI === 'function') updateDashboardUI();
        e.target.reset();
        switchView('dashboard');
    } else {
        showError('login-password', 'Invalid username/email or password.');
    }
}

function handleLogOutAction() {
    window.currentUser = null;
    localStorage.removeItem('bank_active_user');
    switchView('login-page');
}



