// Functions that ensures Pre-populated DB does not get overwritten

import Expo, { SQLite } from 'expo';
import React from 'react';
import { FileSystem, Asset } from 'expo';

const dbFileName = 'caatch.db';
const dbDirectoryName = 'SQLite/';
// file and directory names
const directory = FileSystem.documentDirectory + dbDirectoryName;
const file = directory + dbFileName;
// uri's for location of .db file and directory

export const db = SQLite.openDatabase(dbFileName);

export const checkDB = (callback) => {
  FileSystem.getInfoAsync(directory)
    // firstly checking if directory exists
    .then((fileObj) => {
      if (fileObj.exists) {
        console.log('Directory exists');
      } else {
        console.log('Directory DOES NOT exist');
        FileSystem.makeDirectoryAsync(directory).catch((err) => console.error(err));
      }
    })
    .then(() =>
      FileSystem.getInfoAsync(file)
        // then check if file exists
        .then((fileObj) => {
          if (fileObj.exists) {
            console.log('File exists');
            callback();

            //deleteDB();
          } else {
            console.log('File DOES NOT exist');
            //download file here

            FileSystem.downloadAsync(Asset.fromModule(require('../Database/caatch.db')).uri, file)
              .then((res) => console.log(res))
              .then((res) => callback())
              .catch((err) => console.log(err));
            // Have to download file from project directory in order to copy to Expo file system
          }
        })
        .catch((err) => console.error(err))
    )
    .catch((err) => console.error(err));
};
// function checks if .db file exists and copies pre-populated file if not. Does nothing if exists

const deleteDB = () => {
  FileSystem.deleteAsync(file);
};
// function to delete database from file system, FOR TESTING PURPOSES ONLY -> see line 31
