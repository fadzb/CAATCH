// File containing useful function for interacting with SQLite database

import React from 'react';
import { db } from './DatabaseConnector'

const numberParameters = (number) => {
    if (number !== 1) {
        return ("?,".repeat(number - 1) + "?");
    } else {
        return "?";
    }
};
// Function that produces String of '?' based on number of columns to write to

export const updateDatabase = (tableName, writeData, columns) => {
    db.transaction(tx => {
        tx.executeSql(`insert into ${tableName} (${columns.toString()}) values (${numberParameters(columns.length)})`, writeData)
    }, err => console.log(err), () => console.log("DB update success"))
};
// Function that takes table name (String), data to write (array) and column names
// to write to (array) as arguments. See 'CopingStrategies.js' for example of usage