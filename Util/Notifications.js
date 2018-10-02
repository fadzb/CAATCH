// function(s) used for updating notifications after diary entry

import { readDatabase } from '../Util/DatabaseHelper';

export const updateNotifications = () => {
  readDatabase('*', 'User', (res) => {
    if (res[0].notifications === 1) {
      // check if notifications have been enabled in settings table

      Expo.Notifications.cancelAllScheduledNotificationsAsync().then((res) => {
        const localNotification = {
          title: 'Diary Reminder',
          body: "Don't forget to update your diary today!",
          android: {
            sound: true,
          },
          ios: {
            sound: true,
          },
        };

        let tomorrowNoteTime = new Date();
        tomorrowNoteTime.setHours(9, 0, 0);
        tomorrowNoteTime.setDate(tomorrowNoteTime.getDate() + 1);

        const schedulingOptions = { time: tomorrowNoteTime, repeat: 'day' };

        Expo.Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions).then((res) =>
          console.log(res)
        );
      });

      // first cancel all open notifications. Then create same notification for same time tomorrow
    }
  });
};
