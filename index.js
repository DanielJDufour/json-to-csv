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
    skipEmptyColumns = false,
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

  if (skipEmptyColumns) {
    // start out assuming all columns are empty before reading first row
    let emptyColumns = config.columns;

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];

      // only keep if continue not to find valid values
      emptyColumns = emptyColumns.filter(function (col) {
        return [null, undefined, "", "null", "undefined"].includes(row[col]);
      });
    }

    if (debug) console.log("[@danieljdufour/json-to-csv] emptyColumns:", emptyColumns);

    if (emptyColumns.length >= 1) {
      for (let r = 0; r < rows.length; r++) {
        const row = rows[r];
        for (let i = 0; i < emptyColumns.length; i++) {
          const col = emptyColumns[i];
          delete row[col];
        }
      }
      config.columns = config.columns.filter(col => emptyColumns.indexOf(col) === -1);
    }
  }

  const result = unparse(rows, config);

  return result;
}

module.exports = { convert };
