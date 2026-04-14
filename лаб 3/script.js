const messageEl = document.getElementById("message");
const demoListEl = document.getElementById("demoList");
const listEl = document.getElementById("list");

const btnAll = document.getElementById("btnAll");
const btnNew = document.getElementById("btnNew");
const btnSort = document.getElementById("btnSort");
const btnStats = document.getElementById("btnStats");

console.log("E2:", helloFromLogic());

messageEl.textContent = "DOM работает";
console.log("F1:", messageEl.textContent);

for (let i = 1; i <= 3; i += 1) {
  const p = document.createElement("p");
  p.textContent = "Дем. строка " + i;
  demoListEl.appendChild(p);
}
console.log("F2: в #demoList добавлено 3 элемента <p>");

function renderList(itemsToRender) {
  listEl.textContent = "";

  for (const item of itemsToRender) {
    const card = document.createElement("article");

    const titleEl = document.createElement("h3");
    titleEl.textContent = item.title;

    const infoEl = document.createElement("p");
    infoEl.textContent =
      "id=" + item.id +
      " | value=" + item.value +
      " | status=" + item.status +
      " | createdAt=" + item.createdAt;

    const btnRemove = document.createElement("button");
    btnRemove.textContent = "Удалить";
    btnRemove.dataset.action = "remove";
    btnRemove.dataset.id = String(item.id);

    card.appendChild(titleEl);
    card.appendChild(infoEl);
    card.appendChild(btnRemove);

    listEl.appendChild(card);
  }
}

btnAll.addEventListener("click", function () {
  renderList(items);
  messageEl.textContent = "Показаны все новости";
});

btnNew.addEventListener("click", function () {
  renderList(filterByStatus(items, "new"));
  messageEl.textContent = "Показаны только новости со status=new";
});

btnSort.addEventListener("click", function () {
  renderList(sortByValueDesc(items));
  messageEl.textContent = "Новости отсортированы по value";
});

btnStats.addEventListener("click", function () {
  const stats = buildStats(items);
  messageEl.textContent =
    "Всего записей: " + stats.totalCount +
    ", Сумма value: " + stats.sumValue +
    ", Максимум value: " + stats.maxValue +
    ', Количество status="new": ' + stats.newCount;
});

listEl.addEventListener("click", function (event) {
  if (event.target.dataset.action === "remove") {
    const id = Number(event.target.dataset.id);

    if (removeById(items, id)) {
      renderList(items);
      messageEl.textContent = "Запись с id=" + id + " удалена";
    }
  }
});

renderList(items);