console.log('Скрипт news feed подключен успешно');

const countBtn = document.getElementById('countBtn');
const toggleBtn = document.getElementById('toggleBtn');
const clearBtn = document.getElementById('clearBtn');
const result = document.getElementById('result');
const categoryList = document.getElementById('categoryList');
const newsList = document.querySelectorAll('article');

countBtn.addEventListener('click', function () {
    result.textContent = 'Количество новостей: ' + newsList.length;
});

toggleBtn.addEventListener('click', function () {
    if (categoryList.style.display === 'none') {
        categoryList.style.display = 'block';
        toggleBtn.textContent = 'Скрыть категории';
        result.textContent = 'Список категорий снова показан.';
    } else {
        categoryList.style.display = 'none';
        toggleBtn.textContent = 'Показать категории';
        result.textContent = 'Список категорий скрыт.';
    }
});

clearBtn.addEventListener('click', function () {
    result.textContent = 'Строка очищена.';
});
