// --- 1. АВТОРИЗАЦИЯ ---
const SECRET_PASSWORD = "123";

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
const schedule = [
    { name: "1 урок", start: "08:30", end: "09:15" },
    { name: "Перемена", start: "09:15", end: "09:30" },
    { name: "2 урок", start: "09:30", end: "10:15" },
    { name: "Перемена", start: "10:15", end: "10:35" },
    { name: "3 урок", start: "10:35", end: "11:20" }
];

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('clock').textContent = timeString;

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

setInterval(updateClock, 1000);
updateClock();

// --- 4. БАЗА ДАННЫХ И ЖУРНАЛ ОТСУТСТВУЮЩИХ ---
// Ваша личная ссылка на базу данных уже здесь!
const DB_URL = "https://script.google.com/macros/s/AKfycbzHWH_OcudJqm5-23H48fQjd4xNHZLhd1gGRkPyaxOqXellHUXRV8yHpe9FVmNPfWO6/exec";

// Список вашего класса (можно менять фамилии)
const students = ["Алексеев Иван", "Борисова Анна", "Васильев Петр", "Григорьева Мария"];

function renderStudentList() {
    const listContainer = document.getElementById('student-list');
    if (!listContainer) return; 
    listContainer.innerHTML = '';
    
    students.forEach(student => {
        const div = document.createElement('div');
        div.className = 'student-item';
        div.innerHTML = `
            <span>${student}</span>
            <input type="checkbox" class="absent-checkbox" value="${student}">
        `;
        listContainer.appendChild(div);
    });
}

function saveAttendance() {
    const checkboxes = document.querySelectorAll('.absent-checkbox:checked');
    const absentStudents = Array.from(checkboxes).map(cb => cb.value);
    const statusText = document.getElementById('attendance-status');
    
    if (absentStudents.length === 0) {
        statusText.style.display = 'block';
        statusText.style.color = '#333';
        statusText.textContent = "Все присутствуют!";
        setTimeout(() => statusText.style.display = 'none', 3000);
        return;
    }

    statusText.style.display = 'block';
    statusText.textContent = 'Отправка в базу...';
    statusText.style.color = '#e74c3c';

    const dateStr = new Date().toLocaleDateString('ru-RU');
    const data = [dateStr, absentStudents.join(', ')];

    fetch(DB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'sheetName=Attendance&data=' + encodeURIComponent(JSON.stringify(data))
    })
    .then(response => response.text())
    .then(result => {
        statusText.textContent = 'Успешно сохранено!';
        statusText.style.color = 'green';
        setTimeout(() => {
            statusText.style.display = 'none';
            checkboxes.forEach(cb => cb.checked = false);
        }, 3000);
    })
    .catch(error => {
        statusText.textContent = 'Ошибка сохранения!';
        console.error(error);
    });
}

// Запускаем отрисовку списка
renderStudentList();
