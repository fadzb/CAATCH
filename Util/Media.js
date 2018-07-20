import React from 'react';
import Expo from 'expo';

const directoryName = 'SafetyplanMedia/';
// file and directory names
const directory = Expo.FileSystem.documentDirectory + directoryName;

export const mediaDirectoryCheck = () => {
    Expo.FileSystem.getInfoAsync(directory)
    // firstly checking if directory exists
        .then(fileObj => {
            if (fileObj.exists && fileObj.isDirectory) {
                console.log("SP Media directory exists")
                //deleteMediaDirectory();
            } else {
                console.log("SP Media directory DOES NOT exist");
                Expo.FileSystem.makeDirectoryAsync(directory)
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.error(err))
};
// function checks if .db file exists and copies pre-populated file if not. Does nothing if exists

const deleteMediaDirectory = () => {
    Expo.FileSystem.deleteAsync(directory)
};
// function to delete Media Directory from file system, FOR TESTING PURPOSES ONLY -> see line 14