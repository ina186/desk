// --- 1. АВТОРИЗАЦИЯ ---
const SECRET_PASSWORD = "123"; // <-- Поменяйте пароль здесь!

function checkPassword() {
    const input = document.getElementById('password-input').value;
    if (input === SECRET_PASSWORD) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    } else {
        document.getElementById('error-msg').style.display = 'block';
    }
}

// --- 2. ПЕРЕКЛЮЧЕНИЕ ТЕМЫ ---
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    body.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
}

// --- 3. ВИДЖЕТ "ПРЯМОЙ ЭФИР" (РАСПИСАНИЕ ЗВОНКОВ) ---
// Настройте свое расписание звонков здесь (формат 'ЧЧ:ММ')
const schedule = [
    { name: "1 урок", start: "08:30", end: "09:15" },
    { name: "Перемена", start: "09:15", end: "09:30" },
    { name: "2 урок", start: "09:30", end: "10:15" },
    { name: "Перемена", start: "10:15", end: "10:35" },
    { name: "3 урок", start: "10:35", end: "11:20" }
];

function updateClock() {
    const now = new Date();
    // Часы
    const timeString = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('clock').textContent = timeString;

    // Вычисление текущего урока
    let currentPhase = "Уроки закончились (или еще не начались)";
    let nextPhase = "-";
    let timeLeft = "--:--";

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (let i = 0; i < schedule.length; i++) {
        let startArr = schedule[i].start.split(':');
        let endArr = schedule[i].end.split(':');
        let startMins = parseInt(startArr[0]) * 60 + parseInt(startArr[1]);
        let endMins = parseInt(endArr[0]) * 60 + parseInt(endArr[1]);

        if (currentMinutes >= startMins && currentMinutes < endMins) {
            currentPhase = schedule[i].name;
            nextPhase = schedule[i+1] ? schedule[i+1].name : "Домой!";
            
            // Считаем сколько осталось до звонка
            let diffMins = endMins - currentMinutes - 1;
            let diffSecs = 59 - now.getSeconds();
            timeLeft = `${diffMins.toString().padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')}`;
            break;
        }
    }

    document.getElementById('current-lesson').textContent = currentPhase;
    document.getElementById('time-left').textContent = timeLeft;
    document.getElementById('next-lesson').textContent = nextPhase;
}

// Запускаем часы каждую секунду
setInterval(updateClock, 1000);
updateClock();
