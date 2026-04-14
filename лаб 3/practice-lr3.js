// Блок A
function calcTotal(a, b) {
  return a + b;
}
console.log("A1:", calcTotal(10, 5));

function formatRecord(id, title, status) {
  return `#${id} ${title} [${status}]`;
}
console.log("A2:", formatRecord(3, "Тест", "new"));

// Блок B
const values = [1200, 500, 800, 1500];
let valuesSum = 0;
for (let i = 0; i < values.length; i += 1) {
  valuesSum += values[i];
}
console.log("B1:", valuesSum);

const filteredValues = values.filter(function (value) {
  return value >= 800;
});
console.log("B2:", filteredValues);

// Блок C
const record = {
  id: 5,
  title: "Новость 5",
  value: 1450,
  status: "new",
  createdAt: "2026-04-14"
};
console.log("C1 до изменения:", record);
record.status = "published";
console.log("C1 после изменения:", record);

function isNew(recordItem) {
  return recordItem.status === "new";
}

const newRecord = {
  id: 6,
  title: "Новость 6",
  value: 1700,
  status: "new",
  createdAt: "2026-04-15"
};

const doneRecord = {
  id: 4,
  title: "Новость 4",
  value: 760,
  status: "archived",
  createdAt: "2026-04-11"
};

console.log("C2 newRecord:", isNew(newRecord));
console.log("C2 doneRecord:", isNew(doneRecord));

// Блок D
const testItems = [
  { id: 1, title: "Новость 1", value: 1800, status: "published", createdAt: "2026-04-08" },
  { id: 2, title: "Новость 2", value: 950, status: "published", createdAt: "2026-04-09" },
  { id: 3, title: "Новость 3", value: 2200, status: "published", createdAt: "2026-04-10" },
  { id: 4, title: "Новость 4", value: 760, status: "archived", createdAt: "2026-04-11" }
];

const foundItem = testItems.find(function (item) {
  return item.id === 3;
}) || null;
console.log("D1:", foundItem);

const testStats = testItems.reduce(function (acc, item) {
  acc.totalCount += 1;
  acc.sumValue += item.value;
  return acc;
}, { totalCount: 0, sumValue: 0 });
console.log("D2:", testStats);

// Блок E
console.log("Успешно!");