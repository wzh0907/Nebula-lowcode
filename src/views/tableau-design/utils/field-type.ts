let isStringDict = [
  "CHAR",
  "VARCHAR",
  "TINYBLOB",
  "TINYTEXT",
  "BLOB",
  "TEXT",
  "MEDIUMBLOB",
  "MEDIUMTEXT",
  "LONGBLOB",
  "LONGTEXT"
]
let isNumberDict = [
  "BIT",
  "BOOL",
  "TINYINT",
  "SMALLINT",
  "MEDIUMINT",
  "INT",
  "INTEGER",
  "BIGINT",
  "FLOAT",
  "DOUBLE",
  "DECIMAL"
]
let isDatetimeDict = ["DATETIME", "TIMESTAMP", "YEAR", "TIME", "DATE"]

export {
  isStringDict,
  isNumberDict,
  isDatetimeDict
}
