// function for tracking app use cases

import store from '../Redux/store';
import {updateDatabase} from "../Util/DatabaseHelper";
import {DbTableNames} from "../Constants/Constants";

export const openSafetyPlanItem = (functionId, tableName, tableId, columnName, idName) => {
    updateDatabase(DbTableNames.functionUsage,
        [store.getState().usage, functionId, tableName, tableId, columnName, idName],
        ['usageId', 'functionId', 'tableName', 'tableId', 'columnName', 'idName'])
};