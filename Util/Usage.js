// function for tracking app use cases

import store from '../Redux/store';
import { updateDatabase } from '../Util/DatabaseHelper';

export const openSafetyPlanItem = (functionId, tableName, tableId) => {
  updateDatabase(
    'FunctionUsage',
    [store.getState().usage, functionId, tableName, tableId],
    ['usageId', 'functionId', 'tableName', 'tableId']
  );
};
