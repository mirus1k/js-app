(function () {
  function isValidDateYMD(s) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(s));
  }

  function isRealDateYMD(s) {
    if (!isValidDateYMD(s)) {
      return false;
    }

    const parts = s.split("-");
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }

  function isValidTitle(s) {
    return /^[^<>{};]+$/.test(String(s));
  }

  function extractIds(text) {
    const matches = String(text).match(/\d+/g) || [];
    return matches.map(Number);
  }

  function normalizeSpaces(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
  }

  function validateRequired(value, fieldName) {
    if (normalizeSpaces(value) === "") {
      return `Поле ${fieldName} обязательно`;
    }

    return null;
  }

  function validateNumberRange(n, min, max, fieldName) {
    if (Number.isNaN(n)) {
      return `Поле ${fieldName} должно быть числом`;
    }

    if (n < min || n > max) {
      return `Поле ${fieldName} должно быть в диапазоне от ${min} до ${max}`;
    }

    return null;
  }

  function buildRecordFromForm(raw) {
    return {
      title: normalizeSpaces(raw.title),
      value: Number(raw.value),
      status: String(raw.status || "").trim(),
      createdAt: String(raw.createdAt || "").trim()
    };
  }

  function collectErrors(record) {
    const errors = [];

    const titleRequiredError = validateRequired(record.title, "Название");
    if (titleRequiredError) {
      errors.push(titleRequiredError);
    }

    if (record.title !== "" && !isValidTitle(record.title)) {
      errors.push("Название содержит запрещённые символы: < > { } ;");
    }

    const valueError = validateNumberRange(record.value, 0, 1000000, "Value");
    if (valueError) {
      errors.push(valueError);
    }

    const createdAtRequiredError = validateRequired(record.createdAt, "Дата");
    if (createdAtRequiredError) {
      errors.push(createdAtRequiredError);
    } else if (!isValidDateYMD(record.createdAt)) {
      errors.push("Дата должна быть в формате YYYY-MM-DD");
    } else if (!isRealDateYMD(record.createdAt)) {
      errors.push("Дата введена некорректно");
    }

    const statusRequiredError = validateRequired(record.status, "Статус");
    if (statusRequiredError) {
      errors.push(statusRequiredError);
    }

    return errors;
  }

  function getNextId(list) {
    if (list.length === 0) {
      return 1;
    }

    let maxId = 0;

    for (let i = 0; i < list.length; i += 1) {
      if (list[i].id > maxId) {
        maxId = list[i].id;
      }
    }

    return maxId + 1;
  }

  function filterNewItems(list) {
    return list.filter(function (item) {
      return item.status === "new";
    });
  }

  function sortByValueDesc(list) {
    return list.slice().sort(function (a, b) {
      return b.value - a.value;
    });
  }

  function getStats(list) {
    const stats = {
      total: list.length,
      newCount: 0,
      publishedCount: 0,
      archivedCount: 0,
      sumValue: 0,
      averageValue: 0
    };

    for (let i = 0; i < list.length; i += 1) {
      stats.sumValue += list[i].value;

      if (list[i].status === "new") {
        stats.newCount += 1;
      }

      if (list[i].status === "published") {
        stats.publishedCount += 1;
      }

      if (list[i].status === "archived") {
        stats.archivedCount += 1;
      }
    }

    if (list.length > 0) {
      stats.averageValue = Math.round(stats.sumValue / list.length);
    }

    return stats;
  }

  function removeItemById(list, id) {
    const index = list.findIndex(function (item) {
      return item.id === id;
    });

    if (index === -1) {
      return false;
    }

    list.splice(index, 1);
    return true;
  }

  function addManyItems(list, newItems) {
    for (let i = 0; i < newItems.length; i += 1) {
      list.push(newItems[i]);
    }

    return list;
  }

  function normalizeApiValue(x) {
    if (typeof x === "number" && !Number.isNaN(x)) {
      return x;
    }

    if (typeof x === "string") {
      const parsed = Number(x);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }

    return 0;
  }

  function delay(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  async function safeFetchJson(url) {
    let response;

    try {
      response = await fetch(url);
    } catch (error) {
      return {
        ok: false,
        error: "Сетевая ошибка",
        details: String(error)
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        error: `HTTP ошибка: ${response.status}`,
        details: response.statusText
      };
    }

    let text;

    try {
      text = await response.text();
    } catch (error) {
      return {
        ok: false,
        error: "Не удалось прочитать ответ",
        details: String(error)
      };
    }

    if (text.trim() === "") {
      return {
        ok: false,
        error: "Пустой ответ",
        details: "Сервер вернул пустую строку"
      };
    }

    return tryParseJson(text);
  }

  function tryParseJson(text) {
    try {
      return {
        ok: true,
        data: JSON.parse(text)
      };
    } catch (error) {
      return {
        ok: false,
        error: "Ошибка JSON",
        details: String(error)
      };
    }
  }

  async function loadExternalNews(limit, startId) {
    const result = await safeFetchJson(
      `https://jsonplaceholder.typicode.com/posts?_limit=${limit}`
    );

    if (!result.ok) {
      return result;
    }

    if (!Array.isArray(result.data)) {
      return {
        ok: false,
        error: "Неверный формат данных",
        details: "Ожидался массив записей"
      };
    }

    const createdAt = new Date().toISOString().slice(0, 10);
    const prepared = result.data.slice(0, limit).map(function (post, index) {
      const id = startId + index;

      return {
        id: id,
        title: normalizeSpaces(post.title || `Внешняя новость ${id}`),
        value: normalizeApiValue(post.id) * 100,
        status: "published",
        createdAt: createdAt
      };
    });

    return {
      ok: true,
      data: prepared
    };
  }

  window.NewsLogic = {
    isValidDateYMD: isValidDateYMD,
    isRealDateYMD: isRealDateYMD,
    isValidTitle: isValidTitle,
    extractIds: extractIds,
    normalizeSpaces: normalizeSpaces,
    validateRequired: validateRequired,
    validateNumberRange: validateNumberRange,
    buildRecordFromForm: buildRecordFromForm,
    collectErrors: collectErrors,
    getNextId: getNextId,
    filterNewItems: filterNewItems,
    sortByValueDesc: sortByValueDesc,
    getStats: getStats,
    removeItemById: removeItemById,
    addManyItems: addManyItems,
    normalizeApiValue: normalizeApiValue,
    delay: delay,
    safeFetchJson: safeFetchJson,
    tryParseJson: tryParseJson,
    loadExternalNews: loadExternalNews
  };
})();
