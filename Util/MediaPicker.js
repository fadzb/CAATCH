import React from 'react';
import Expo from 'expo';

export const mediaPicker = () => {
    Expo.Permissions.askAsync(Expo.Permissions.CAMERA_ROLL)
        .then(response => {
            if (response.status !== "granted") {
                console.error("Camera roll permission not granted!");
                return;
            }

            Expo.ImagePicker.launchImageLibraryAsync()
                .then(selectedMedia => console.log(selectedMedia))
        })
};
// function for displaying device camera roll and selecting images/videos