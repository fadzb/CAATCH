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

export const updateDatabase = (tableName, writeData, columns) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        `insert into ${tableName} (${columns.toString()}) values (${numberParameters(columns.length)})`,
        writeData
      );
    },
    (err) => console.log(err),
    () => console.log('DB update success')
  );
};
// Function that takes table name (String), data to write (array) and column names
// to write to (array) as arguments. See 'NewCopingStrategy.js' for example of usage.
// Important the object keys are named the same as DB columns/fields

export const readDatabase = (column, table, func) => {
  let arr = [2, 2];

  db.transaction(
    (tx) => {
      tx.executeSql(
        `select ${column} from ${table}`,
        [],
        (_, resultSet) => func(resultSet.rows._array),
        (_, err) => console.log(err)
      );
    },
    (err) => console.log(err),
    () => console.log('DB read success')
  );
};
// Function for reading from DB. Takes callback function that takes
// result array as only argument. Only works with * or one column for now
