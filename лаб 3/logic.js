function helloFromLogic() {
  return "logic works";
}

function filterByStatus(items, status) {
  return items.filter(function (item) {
    return item.status === status;
  });
}

function findById(items, id) {
  return items.find(function (item) {
    return item.id === id;
  }) || null;
}

function sortByValueDesc(items) {
  const copy = items.slice();
  copy.sort(function (a, b) {
    return b.value - a.value;
  });
  return copy;
}

function buildStats(items) {
  return items.reduce(function (acc, item) {
    acc.totalCount += 1;
    acc.sumValue += item.value;
    if (item.value > acc.maxValue) {
      acc.maxValue = item.value;
    }
    if (item.status === "new") {
      acc.newCount += 1;
    }
    return acc;
  }, {
    totalCount: 0,
    sumValue: 0,
    maxValue: 0,
    newCount: 0
  });
}

function removeById(items, id) {
  const index = items.findIndex(function (item) {
    return item.id === id;
  });

  if (index === -1) {
    return false;
  }

  items.splice(index, 1);
  return true;
}
