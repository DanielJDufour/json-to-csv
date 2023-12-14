const { get, listPaths } = require("sendero");
const { unparse } = require("papaparse");

function convert(
  data,
  {
    columns,
    clean = true,
    debug,
    delimiter,
    escapeChar,
    escapeFormulae,
    limit,
    header,
    newline,
    offset = 0,
    sep,
    skipEmptyLines,
    sort: _sort = true,
    start,
    subdelimiter = "; ",
    quotes,
    quoteChar,
    unique = true
  }
) {
  const items = [".", "", undefined, null].includes(start) ? data : get(data, start);
  if (debug) console.log("[@danieljdufour/json-to-csv] items:", items);

  if (!columns) {
    columns = listPaths(items).map(function (path) {
      return { name: path, path: path };
    });
  }
  if (debug) console.log("[@danieljdufour/json-to-csv] columns:", columns);

  const rows = [];
  const imax = offset + (typeof limit === "number" ? Math.min(limit, items.length) : items.length);
  for (let i = offset; i < imax; i++) {
    const item = items[i];
    const row = {};
    for (let c = 0; c < columns.length; c++) {
      const col = columns[c];
      row[col.name] = get(item, col.path, { clean, sep, sort: _sort, stringify: true, unique }).join(subdelimiter);
    }
    rows.push(row);
  }

  const config = {
    columns: columns.map(function (col) {
      return col.name;
    }),
    delimiter,
    escapeChar,
    escapeFormulae,
    header,
    newline,
    skipEmptyLines,
    quotes,
    quoteChar
  };
  if (debug) console.log("[@danieljdufour/json-to-csv] config:", config);

  const result = unparse(rows, config);

  return result;
}

module.exports = { convert };
