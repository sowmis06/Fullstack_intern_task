function parseId(value) {
  const id = Number(value);
  if (Number.isInteger(id) && id > 0) {
    return id;
  }
  return null;
}

function formatTemplate(row) {
  return { ...row, features: JSON.parse(row.features) };
}

module.exports = { parseId, formatTemplate };
