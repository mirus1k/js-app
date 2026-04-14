const showAllBtn = document.getElementById("showAllBtn");
const showNewBtn = document.getElementById("showNewBtn");
const sortBtn = document.getElementById("sortBtn");
const statsBtn = document.getElementById("statsBtn");
const loadBtn = document.getElementById("loadBtn");
const formEl = document.getElementById("recordForm");
const titleInputEl = document.getElementById("titleInput");
const valueInputEl = document.getElementById("valueInput");
const statusInputEl = document.getElementById("statusInput");
const createdAtInputEl = document.getElementById("createdAtInput");
const listEl = document.getElementById("list");
const messageEl = document.getElementById("message");
const formErrorsEl = document.getElementById("formErrors");
const domDemoListEl = document.getElementById("domDemoList");

const state = {
  mode: "all"
};

function setMessage(text) {
  messageEl.textContent = text;
}

function clearFormErrors() {
  formErrorsEl.innerHTML = "";
}

function renderFormErrors(errors) {
  clearFormErrors();

  if (errors.length === 0) {
    return;
  }

  const ul = document.createElement("ul");

  for (let i = 0; i < errors.length; i += 1) {
    const li = document.createElement("li");
    li.textContent = errors[i];
    ul.appendChild(li);
  }

  formErrorsEl.appendChild(ul);
}

function getVisibleItems() {
  if (state.mode === "new") {
    return window.NewsLogic.filterNewItems(window.items);
  }

  if (state.mode === "sorted") {
    return window.NewsLogic.sortByValueDesc(window.items);
  }

  return window.items;
}

function renderList(list) {
  listEl.innerHTML = "";

  if (list.length === 0) {
    const emptyText = document.createElement("p");
    emptyText.textContent = "Список пуст";
    listEl.appendChild(emptyText);
    return;
  }

  for (let i = 0; i < list.length; i += 1) {
    const item = list[i];
    const article = document.createElement("article");
    const title = document.createElement("h3");
    const meta = document.createElement("p");
    const button = document.createElement("button");

    title.textContent = item.title;
    meta.textContent = `id=${item.id} | value=${item.value} | status=${item.status} | createdAt=${item.createdAt}`;
    button.type = "button";
    button.textContent = "Удалить";
    button.dataset.id = String(item.id);

    article.appendChild(title);
    article.appendChild(meta);
    article.appendChild(button);
    listEl.appendChild(article);
  }
}

function refreshList() {
  renderList(getVisibleItems());
}

function showStats() {
  const stats = window.NewsLogic.getStats(window.items);
  setMessage(
    `Всего: ${stats.total}. NEW: ${stats.newCount}. PUBLISHED: ${stats.publishedCount}. ARCHIVED: ${stats.archivedCount}. Сумма value: ${stats.sumValue}. Среднее value: ${stats.averageValue}.`
  );
}

showAllBtn.addEventListener("click", function () {
  state.mode = "all";
  refreshList();
  setMessage("Показаны все новости");
});

showNewBtn.addEventListener("click", function () {
  state.mode = "new";
  refreshList();
  setMessage("Показаны только новости со статусом new");
});

sortBtn.addEventListener("click", function () {
  state.mode = "sorted";
  refreshList();
  setMessage("Список отсортирован по value по убыванию");
});

statsBtn.addEventListener("click", function () {
  showStats();
});

loadBtn.addEventListener("click", async function () {
  setMessage("Загрузка данных...");

  const result = await window.NewsLogic.loadExternalNews(
    3,
    window.NewsLogic.getNextId(window.items)
  );

  if (!result.ok) {
    setMessage(`Ошибка загрузки: ${result.error}`);
    console.error(result.details);
    return;
  }

  window.NewsLogic.addManyItems(window.items, result.data);
  state.mode = "all";
  refreshList();
  setMessage(`Загружено записей: ${result.data.length}`);
});

formEl.addEventListener("submit", function (event) {
  event.preventDefault();

  const raw = {
    title: titleInputEl.value,
    value: valueInputEl.value,
    status: statusInputEl.value,
    createdAt: createdAtInputEl.value
  };

  const record = window.NewsLogic.buildRecordFromForm(raw);
  const errors = window.NewsLogic.collectErrors(record);

  if (errors.length > 0) {
    renderFormErrors(errors);
    setMessage("Исправьте ошибки формы");
    return;
  }

  clearFormErrors();

  const newItem = {
    id: window.NewsLogic.getNextId(window.items),
    title: record.title,
    value: record.value,
    status: record.status,
    createdAt: record.createdAt
  };

  window.items.push(newItem);
  formEl.reset();
  state.mode = "all";
  refreshList();
  setMessage(`Новость ${newItem.id} добавлена`);
});

listEl.addEventListener("click", function (event) {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const id = Number(target.dataset.id);
  const wasDeleted = window.NewsLogic.removeItemById(window.items, id);

  if (!wasDeleted) {
    setMessage("Не удалось удалить запись");
    return;
  }

  refreshList();
  setMessage(`Новость ${id} удалена`);
});

const extraDemoRow = document.createElement("li");
extraDemoRow.textContent = "Дем. строка 4";
domDemoListEl.appendChild(extraDemoRow);

refreshList();
setMessage("Готово к работе");
