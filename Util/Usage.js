// function for tracking app use cases

import store from '../Redux/store';
import { updateDatabase } from '../Util/DatabaseHelper';
import { DbTableNames } from '../Constants/Constants';
import { updateDatabaseArgument } from './DatabaseHelper';
import Moment from 'moment';

export const openSafetyPlanItem = (functionId, tableName, tableId, columnName, idName) => {
  updateDatabase(
    DbTableNames.functionUsage,
    [store.getState().usage, functionId, tableName, tableId, columnName, idName],
    ['usageId', 'functionId', 'tableName', 'tableId', 'columnName', 'idName']
  );
};

export const latestSafetyPlanItem = (functionId, tableId, idName) => {
  updateDatabaseArgument(
    DbTableNames.functionUsage,
    [store.getState().usage, Moment().format('YYYY-MM-DD HH:mm:ss.SSS'), tableId, idName],
    ['usageId', 'dateEntered', 'tableId', 'idName'],
    'where functionId = ' + functionId
  );
};
