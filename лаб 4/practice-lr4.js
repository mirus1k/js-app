// Блок A
console.log("A1:", window.NewsLogic.isValidDateYMD("2026-02-18"));
console.log("A1:", window.NewsLogic.isValidDateYMD("18.02.2026"));
console.log("A1:", window.NewsLogic.isValidDateYMD(""));

console.log("A2:", window.NewsLogic.isValidTitle("Обычная новость"));
console.log("A2:", window.NewsLogic.isValidTitle("Новость < 1"));
console.log("A2:", window.NewsLogic.isValidTitle("Новость; 1"));

// Блок B
console.log("B1:", window.NewsLogic.extractIds("id=5; id=12; id=30"));
console.log("B2:", window.NewsLogic.normalizeSpaces(" A B\t\tC "));

// Блок C
console.log("C1:", window.NewsLogic.validateRequired("   ", "Название"));
console.log("C1:", window.NewsLogic.validateRequired(" ok ", "Название"));

console.log("C2:", window.NewsLogic.validateNumberRange(10, 0, 100, "Value"));
console.log("C2:", window.NewsLogic.validateNumberRange(-1, 0, 100, "Value"));
console.log("C2:", window.NewsLogic.validateNumberRange(Number.NaN, 0, 100, "Value"));

// Блок D
const rawRecord = {
  title: "  Новость    дня  ",
  value: "250",
  status: "new",
  createdAt: "2026-04-14"
};

const builtRecord = window.NewsLogic.buildRecordFromForm(rawRecord);
console.log("D1:", builtRecord);

const validRecord = {
  title: "Новая новость",
  value: 250,
  status: "new",
  createdAt: "2026-04-14"
};

const invalidRecord = {
  title: "Плохая < новость",
  value: Number.NaN,
  status: "",
  createdAt: "2026-99-99"
};

console.log("D2:", window.NewsLogic.collectErrors(validRecord));
console.log("D2:", window.NewsLogic.collectErrors(invalidRecord));

// Блок E
async function runDelayTest() {
  await window.NewsLogic.delay(500);
  console.log("E1:", "done");
}

runDelayTest();

async function runFetchTest() {
  const result = await window.NewsLogic.safeFetchJson("https://jsonplaceholder.typicode.com/todos/1");
  console.log("E2:", result);
}

runFetchTest();

// Блок F
console.log("F1:", window.NewsLogic.tryParseJson('{"a":1}'));
console.log("F1:", window.NewsLogic.tryParseJson("{a:1}"));

console.log("F2:", window.NewsLogic.normalizeApiValue(10));
console.log("F2:", window.NewsLogic.normalizeApiValue("20"));
console.log("F2:", window.NewsLogic.normalizeApiValue(null));
console.log("F2:", window.NewsLogic.normalizeApiValue("abc"));
