document.addEventListener('DOMContentLoaded', () => {
    // Функции для авторизации, регистрации и игры
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('registration-form');
    const playButton = document.getElementById('play-button');
    const topUpButton = document.getElementById('top-up-button');
    const chancesMessage = document.getElementById('chances-message');
    const balanceMessage = document.getElementById('balance-message');
    const guessInput = document.getElementById('guess-input');
    const submitButton = document.getElementById('submit-button');
    const message = document.getElementById('message');
    const restartButton = document.getElementById('restart-button');
    const responseMessage = document.getElementById('response-message');
    const nameInput = document.getElementById('name');
    const registrationMessage = document.getElementById('registration-message');

    function getUserData() {
        return {
            freeChances: 3,
            lastAttempt: Date.now() - 24 * 60 * 60 * 1000
        };
    }

    function updateUI() {
        const userData = getUserData();
        const now = Date.now();
        const timeSinceLastAttempt = now - userData.lastAttempt;
        const canPlay = userData.freeChances > 0 || timeSinceLastAttempt >= 12 * 60 * 60 * 1000;

        if (userData.freeChances > 0) {
            chancesMessage.textContent = `У вас ${userData.freeChances} бесплатных шансов.`;
        } else if (canPlay) {
            chancesMessage.textContent = 'Ваши бесплатные шансы обновлены.';
        } else {
            chancesMessage.textContent = 'Вам необходимо пополнить баланс.';
        }

        balanceMessage.textContent = canPlay ? 'Ваша игра начинается!' : 'Вам необходимо пополнить баланс.';
        playButton.disabled = !canPlay;
    }

    playButton.addEventListener('click', () => {
        const userData = getUserData();
        const now = Date.now();
        const timeSinceLastAttempt = now - userData.lastAttempt;

        if (userData.freeChances > 0) {
            userData.freeChances--;
            userData.lastAttempt = now;
            updateUI();
            balanceMessage.textContent = 'Ваша игра начинается!';
        } else if (timeSinceLastAttempt >= 12 * 60 * 60 * 1000) {
            userData.freeChances = 3;
            userData.freeChances--;
            userData.lastAttempt = now;
            updateUI();
            balanceMessage.textContent = 'Ваша игра начинается!';
        } else {
            balanceMessage.textContent = 'Вам необходимо пополнить баланс.';
        }
    });

    topUpButton.addEventListener('click', () => {
        const amount = prompt('Введите сумму для пополнения:');
        if (amount) {
            alert(`Ваш баланс пополнен на ${amount} единиц.`);
            updateUI();
        }
    });

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = nameInput.value.trim();
        if (name) {
            localStorage.setItem('username', name);
            registrationMessage.textContent = `Добро пожаловать, ${name}!`;
            updateUI();
            document.getElementById('game-container').style.display = 'block';
        }
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (username === 'admin' && password === 'password') {
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('admin-container').style.display = 'block';
        } else {
            document.getElementById('login-message').textContent = 'Неправильное имя пользователя или пароль.';
        }
    });

    // Обработчик формы пополнения баланса в админ панели
    document.getElementById('top-up-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const userId = document.getElementById('user-id').value;
        const amount = document.getElementById('amount').value;
        if (userId && amount) {
            responseMessage.textContent = `Баланс пользователя с ID ${userId} был пополнен на ${amount} единиц.`;
        }
    });

    restartButton.addEventListener('click', () => {
        guessInput.value = '';
        message.textContent = '';
        restartButton.style.display = 'none';
        updateUI();
    });

    submitButton.addEventListener('click', () => {
        const userGuess = parseInt(guessInput.value);
        const correctNumber = Math.floor(Math.random() * 100) + 1;
        if (userGuess === correctNumber) {
            message.textContent = 'Вы угадали!';
            restartButton.style.display = 'block';
        } else {
            message.textContent = `Неверно. Правильный ответ был: ${correctNumber}`;
            restartButton.style.display = 'block';
        }
    });

    updateUI();
});

