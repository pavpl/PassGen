const passwordEl = document.getElementById('password');
const lengthEl = document.getElementById('length');
const lengthValueEl = document.getElementById('length-value');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.querySelector('.strength-text');

const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

// Обновление значения длины пароля
lengthEl.addEventListener('input', () => {
    lengthValueEl.textContent = lengthEl.value;
    generatePassword();
});

// Генерация пароля при изменении настроек
[uppercaseEl, lowercaseEl, numbersEl, symbolsEl].forEach(checkbox => {
    checkbox.addEventListener('change', generatePassword);
});

// Генерация пароля при нажатии кнопки
generateBtn.addEventListener('click', generatePassword);

// Копирование пароля в буфер обмена
copyBtn.addEventListener('click', () => {
    const textarea = document.createElement('textarea');
    const password = passwordEl.value;

    if (!password) return;

    textarea.value = password;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();

    copyBtn.textContent = 'Скопировано!';
    setTimeout(() => {
        copyBtn.textContent = 'Копировать';
    }, 2000);
});

function generatePassword() {
    const length = +lengthEl.value;
    const hasUpper = uppercaseEl.checked;
    const hasLower = lowercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;

    // Проверка, что хотя бы один тип символов выбран
    if (!hasUpper && !hasLower && !hasNumber && !hasSymbol) {
        alert('Пожалуйста, выберите хотя бы один тип символов');
        return;
    }

    let generatedPassword = '';
    const typesArr = [
        {type: 'upper', enabled: hasUpper},
        {type: 'lower', enabled: hasLower},
        {type: 'number', enabled: hasNumber},
        {type: 'symbol', enabled: hasSymbol}
    ].filter(item => item.enabled);

    // Генерация пароля
    for (let i = 0; i < length; i++) {
        const typeObj = typesArr[Math.floor(Math.random() * typesArr.length)];
        generatedPassword += randomFunc[typeObj.type]();
    }

    // Перемешивание
    generatedPassword = shuffleString(generatedPassword);

    passwordEl.value = generatedPassword;
    updateStrengthMeter(generatedPassword);
}

function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomSymbol() {
    const symbols = '!@#$%^&*(){}[]=<>/,.';
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function shuffleString(string) {
    const array = string.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

function updateStrengthMeter(password) {
    let strength = 0;
    // Проверка длины
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (password.length >= 16) strength += 1;
    // Проверка разнообразия символов
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    // Обновление индикатора
    const strengthPercent = (strength / 7) * 100;
    strengthBar.style.width = strengthPercent + '%';
    // Цвет полосы
    let color, text;
    if (strengthPercent < 30) {
        color = '#e74c3c';
        text = 'Слабый';
    } else if (strengthPercent < 70) {
        color = '#f1c40f';
        text = 'Средний';
    } else {
        color = '#2ecc71';
        text = 'Сильный';
    }
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = `Надежность: ${text}`;
}

// Генерация пароля при загрузке страницы
generatePassword(); 