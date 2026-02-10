// API Base URL
const API_URL = 'https://3001-imvji4vnqusqpgvtvfm9g-5b0a2211.us1.manus.computer/api';

// Utility: Get auth token
function getToken() {
    return localStorage.getItem('authToken');
}

// Utility: Set auth token
function setToken(token) {
    localStorage.setItem('authToken', token);
}

// Utility: Remove auth token
function removeToken() {
    localStorage.removeItem('authToken');
}

// Utility: Check if user is authenticated
function isAuthenticated() {
    return !!getToken();
}

// Utility: Redirect to login if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
    }
}

// Utility: Redirect to tasks if already authenticated
function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        window.location.href = '/tasks.html';
    }
}

// Show error message
function showError(elementId, message) {
    const errorDiv = document.getElementById(elementId);
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

// Hide error message
function hideError(elementId) {
    const errorDiv = document.getElementById(elementId);
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Login function
async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao fazer login');
        }

        setToken(data.token);
        window.location.href = '/tasks.html';
    } catch (error) {
        throw error;
    }
}

// Register function
async function register(name, email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao criar conta');
        }

        setToken(data.token);
        window.location.href = '/tasks.html';
    } catch (error) {
        throw error;
    }
}

// Logout function
function logout() {
    removeToken();
    window.location.href = '/login.html';
}

// Login form handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError('loginError');

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await login(email, password);
        } catch (error) {
            showError('loginError', error.message);
        }
    });
}

// Register form handler
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError('registerError');

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            showError('registerError', 'As senhas não coincidem');
            return;
        }

        if (password.length < 6) {
            showError('registerError', 'A senha deve ter pelo menos 6 caracteres');
            return;
        }

        try {
            await register(name, email, password);
        } catch (error) {
            showError('registerError', error.message);
        }
    });
}
