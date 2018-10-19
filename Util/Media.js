import React from 'react';
import Expo from 'expo';
import {updateDatabaseArgument} from "./DatabaseHelper";
import {db} from "./DatabaseConnector";

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
                    .then(res => resetMediaPaths())
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

const resetMediaPaths = () => {
    const mediaTables = {
        CopingStrategy: ['mediaPath', 'mediaType'],
        Reason: ['mediaPath', 'mediaType'],
        Distraction: ['mediaPath', 'mediaType'],
        Contact: ['image'],
    };

    Object.keys(mediaTables).forEach(t => {
        updateDatabaseArgument(t, mediaTables[t].length === 1 ? [null] : [null, null], mediaTables[t], 'where ' + mediaTables[t][0] + ' is not null')
    })
};