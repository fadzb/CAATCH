// File containing useful function for interacting with SQLite database

import React from 'react';
import { db } from './DatabaseConnector';

const numberParameters = (number) => {
  if (number !== 1) {
    return '?,'.repeat(number - 1) + '?';
  } else {
    return '?';
  }
};
// Function that produces String of '?' based on number of columns to write to

export const updateDatabase = (tableName, writeData, columns, func, resultFunc) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        `insert into ${tableName} (${columns.toString()}) values (${numberParameters(columns.length)})`,
        writeData,
        resultFunc !== undefined && ((_, res) => resultFunc(res)),
        (err) => console.log(err)
      );
    },
    (err) => console.log(err),
    func !== undefined && func
  );
};
// Function that takes table name (String), data to write (array) and column names
// to write to (array) as arguments. See 'NewCopingStrategy.js' for example of usage.
// Important the object keys are named the same as DB columns/fields. INSERT function

export const readDatabase = (column, table, resultFunc, func) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        `select ${column} from ${table}`,
        [],
        resultFunc !== undefined && ((_, resultSet) => resultFunc(resultSet.rows._array)),
        (_, err) => console.log(err)
      );
    },
    (err) => console.log(err),
    func !== undefined && func
  );
};

// Function for reading from DB. Takes callback function that takes
// result array as only argument. Only works with * or one column for now

export const updateDatabaseArgument = (tableName, writeData, columns, argument, func, resultFunc) => {
  const columnValues = columns.map((c) => c + '=?').toString();

  db.transaction(
    (tx) => {
      tx.executeSql(
        `update ${tableName} set ${columnValues}` + argument,
        writeData,
        resultFunc !== undefined && ((_, res) => resultFunc(res)),
        (err) => console.log(err)
      );
    },
    (err) => console.log(err),
    func !== undefined && func
  );
};
// for UPDATING not INSERTING

export const readDatabaseArg = (column, table, resultFunc, func, argument) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        `select ${column} from ${table} ` + argument,
        [],
        resultFunc !== undefined && ((_, resultSet) => resultFunc(resultSet.rows._array)),
        (_, err) => console.log(err)
      );
    },
    (err) => console.log(err),
    func !== undefined && func
  );
};
// function for reading DB with additional arguments like joins etc.
