import Expo, { SQLite } from 'expo';
import React from 'react';

export const db = SQLite.openDatabase('caatch.db');