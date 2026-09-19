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

// --- 3. ВИДЖЕТ "ПРЯМОЙ ЭФИР" (РАСПИСАНИЕ ЗВОНКОВ 1 И 2 СМЕНЫ) ---
const scheduleMonday = [
    { name: "1 урок (1 смена)", start: "08:30", end: "09:10" },
    { name: "Перемена", start: "09:10", end: "09:15" },
    { name: "2 урок (1 смена)", start: "09:15", end: "09:55" },
    { name: "Перемена", start: "09:55", end: "10:15" },
    { name: "3 урок (1 смена)", start: "10:15", end: "10:55" },
    { name: "Перемена", start: "10:55", end: "11:15" },
    { name: "4 урок (1 смена)", start: "11:15", end: "11:55" },
    { name: "Перемена", start: "11:55", end: "12:15" },
    { name: "5 урок (1 смена)", start: "12:15", end: "12:55" },
    { name: "Пересменок", start: "12:55", end: "13:10" },
    { name: "1 урок (2 смена)", start: "13:10", end: "13:50" },
    { name: "Перемена", start: "13:50", end: "14:00" },
    { name: "2 урок (2 смена)", start: "14:00", end: "14:40" },
    { name: "Перемена", start: "14:40", end: "15:00" },
    { name: "3 урок (2 смена)", start: "15:00", end: "15:40" },
    { name: "Перемена", start: "15:40", end: "16:00" },
    { name: "4 урок (2 смена)", start: "16:00", end: "16:40" },
    { name: "Перемена", start: "16:40", end: "16:50" },
    { name: "5 урок (2 смена)", start: "16:50", end: "17:30" }
];

const scheduleTueFri = [
    { name: "1 урок (1 смена)", start: "08:00", end: "08:40" },
    { name: "Перемена", start: "08:40", end: "08:50" },
    { name: "2 урок (1 смена)", start: "08:50", end: "09:30" },
    { name: "Перемена", start: "09:30", end: "09:50" },
    { name: "3 урок (1 смена)", start: "09:50", end: "10:30" },
    { name: "Перемена", start: "10:30", end: "10:50" },
    { name: "4 урок (1 смена)", start: "10:50", end: "11:30" },
    { name: "Перемена", start: "11:30", end: "11:50" },
    { name: "5 урок (1 смена)", start: "11:50", end: "12:30" },
    { name: "Пересменок", start: "12:30", end: "12:45" },
    { name: "1 урок (2 смена)", start: "12:45", end: "13:25" },
    { name: "Перемена", start: "13:25", end: "13:35" },
    { name: "2 урок (2 смена)", start: "13:35", end: "14:15" },
    { name: "Перемена", start: "14:15", end: "14:35" },
    { name: "3 урок (2 смена)", start: "14:35", end: "15:15" },
    { name: "Перемена", start: "15:15", end: "15:35" },
    { name: "4 урок (2 смена)", start: "15:35", end: "16:15" },
    { name: "Перемена", start: "16:15", end: "16:25" },
    { name: "5 урок (2 смена)", start: "16:25", end: "17:05" }
];

function getActiveSchedule() {
    const day = new Date().getDay(); // 0 - ВС, 1 - ПН, 2 - ВТ...
    if (day === 1) return scheduleMonday;
    if (day >= 2 && day <= 5) return scheduleTueFri;
    return []; // Выходные
}

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('clock').textContent = timeString;

    const schedule = getActiveSchedule();
    let currentPhase = schedule.length > 0 ? "Уроки закончились (или еще не начались)" : "Выходной! 🎉";
    let nextPhase = "-";
    let timeLeft = "--:--";

    if (schedule.length > 0) {
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
    }

    document.getElementById('current-lesson').textContent = currentPhase;
    document.getElementById('time-left').textContent = timeLeft;
    document.getElementById('next-lesson').textContent = nextPhase;
}

setInterval(updateClock, 1000);
updateClock();

// --- 4. БАЗА ДАННЫХ И ЖУРНАЛ ОТСУТСТВУЮЩИХ ---
const DB_URL = "https://script.google.com/macros/s/AKfycbzHWH_OcudJqm5-23H48fQjd4xNHZLhd1gGRkPyaxOqXellHUXRV8yHpe9FVmNPfWO6/exec";
const CLASS_NAME = "3 В"; 

// Тот самый список класса, импортированный из вашей таблицы
const students = [
    "Акберов Бахтияр", "Багаутдинов Амир", "Булкина Варвара", "Валиев Камиль", 
    "Галиева Эмилия", "Залялов Данияр", "Захаров Раян", "Зиганшина Алина", 
    "Ибрагимов Тимур", "Кузманович Весна", "Матвеев Артём", "Матвеева Вероника", 
    "Махмутов Даян", "Мухтарова Аиша", "Николаев Глеб", "Ногманова Диана", 
    "Пронина Виктория", "Прохоров Мирослав", "Рахматуллина Азалия", "Рыбакова Раяна", 
    "Рыженко Екатерина", "Садриева Аделия", "Саетгареева Елизавета", "Сафаргалиева Эсмира", 
    "Синицин Диас", "Тавбаева Айдарина", "Тазиева Аделя", "Тяминов Радмир", 
    "Хайруллина Малика", "Хакимов Дамир", "Чеканова Анна", "Шалетин Егор", 
    "Шарипов Эмир", "Шёнфельд Арсений"
];

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

// --- ЛОГИКА ВСПЛЫВАЮЩЕГО ОКНА И EXCEL ---
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { 
    document.getElementById(id).style.display = 'none'; 
    document.getElementById('patronage-actions').style.display = 'none';
}

let lastAbsentString = ""; 

function saveAttendance() {
    const checkboxes = document.querySelectorAll('.absent-checkbox:checked');
    const absentNames = Array.from(checkboxes).map(cb => cb.value.split(' ')[0]); 
    
    const actionsDiv = document.getElementById('patronage-actions');
    const statusText = document.getElementById('attendance-status');
    actionsDiv.style.display = 'block';

    const count = absentNames.length;
    const totalStudents = students.length; 
    const lunchCount = totalStudents - count; 
    const namesStr = absentNames.join(', ');

    if (count === 0) {
        lastAbsentString = `${CLASS_NAME}\t${totalStudents}\t0\t0\t\t\t\t\t\t\t${totalStudents}`; 
        statusText.textContent = "Все присутствуют!";
        statusText.style.color = '#333';
    } else {
        lastAbsentString = `${CLASS_NAME}\t${totalStudents}\t${count}\t${count}\t\t\t\t\t${namesStr}\t\t${lunchCount}`;
        statusText.textContent = 'Сохранение в базу...';
        statusText.style.color = '#e74c3c';
    }

    const dateStr = new Date().toLocaleDateString('ru-RU');
    const data = [dateStr, absentNames.join(', ')];

    fetch(DB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'sheetName=Attendance&data=' + encodeURIComponent(JSON.stringify(data))
    })
    .then(() => {
        statusText.textContent = 'Сохранено! Теперь копируйте для Excel.';
        statusText.style.color = 'green';
    })
    .catch(() => {
        statusText.textContent = 'Ошибка (но копировать можно!)';
    });
}

function copyForExcel() {
    navigator.clipboard.writeText(lastAbsentString).then(() => {
        alert("Скопировано! Кликните в ячейку «3 В» и нажмите Вставить (Ctrl+V)");
    });
}

renderStudentList();
