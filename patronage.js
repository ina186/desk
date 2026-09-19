const DB_URL = "https://script.google.com/macros/s/AKfycbzHWH_OcudJqm5-23H48fQjd4xNHZLhd1gGRkPyaxOqXellHUXRV8yHpe9FVmNPfWO6/exec";
const CLASS_NAME = "3 В"; 

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
    
    students.forEach(student => {
        const div = document.createElement('div');
        // Делаем строки крупными и удобными
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        div.style.padding = '12px 0';
        div.style.borderBottom = '1px solid #f0f0f0';
        
        div.innerHTML = `
            <span style="font-size: 1.1em;">${student}</span>
            <input type="checkbox" class="absent-checkbox" value="${student}" style="width: 20px; height: 20px; cursor: pointer;">
        `;
        listContainer.appendChild(div);
    });
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
        statusText.textContent = "Все присутствуют! 🌟";
        statusText.style.color = '#333';
    } else {
        lastAbsentString = `${CLASS_NAME}\t${totalStudents}\t${count}\t${count}\t\t\t\t\t${namesStr}\t\t${lunchCount}`;
        statusText.textContent = 'Данные готовы для Excel!';
        statusText.style.color = 'green';
    }

    // Отправка в базу для истории
    const dateStr = new Date().toLocaleDateString('ru-RU');
    const data = [dateStr, absentNames.join(', ')];
    fetch(DB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'sheetName=Attendance&data=' + encodeURIComponent(JSON.stringify(data))
    });
}

function copyForExcel() {
    navigator.clipboard.writeText(lastAbsentString).then(() => {
        alert("Скопировано!\nТеперь нажмите кнопку «В Excel», выберите ячейку «3 В» и нажмите Вставить (Ctrl+V)");
    });
}

// Рисуем список при открытии страницы
renderStudentList();
