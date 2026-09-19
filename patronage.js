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

let clipboardText = ""; 

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

    const rowData = [
        CLASS_NAME,                                // A
        totalStudents,                             // B
        count,                                     // C
        count,                                     // D
        0,                                         // E
        0,                                         // F
        0,                                         // G
        0,                                         // H
        count === 0 ? "---" : namesStr,            // I
        lunchCount                                 // J
    ];

    if (count === 0) {
        statusText.textContent = "Все присутствуют! 🌟";
        statusText.style.color = '#333';
    } else {
        statusText.textContent = 'Данные готовы для Excel!';
        statusText.style.color = 'green';
    }

    // Собираем чистый текст через табуляцию (разделитель колонок)
    clipboardText = rowData.join('\t');

    const dateStr = new Date().toLocaleDateString('ru-RU');
    const data = [dateStr, absentNames.join(', ')];
    fetch(DB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'sheetName=Attendance&data=' + encodeURIComponent(JSON.stringify(data))
    }).catch(() => console.log('Фоновое сохранение'));
}

// Копируем чистый текст
function copyForExcel() {
    navigator.clipboard.writeText(clipboardText).then(() => {
        const btn = document.querySelector('.icon-btn');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ Готово!';
            btn.style.background = '#d4edda';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '#f0f0f0';
            }, 2000);
        }
    });
}

renderStudentList();
