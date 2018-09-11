// Safety Plan
export const SafetyPlanConstants = {
  distraction: 'Distraction',
  randomSkill: 'RandomSkill',
  copingStrategy: 'CopingStrategy',
  warningSign: 'WarningSign',
};

// DB Table Name
export const DbTableNames = {
  function: 'Function',
  usage: 'Usage',
  functionUsage: 'FunctionUsage',
  contact: 'Contact',
  copeSession: 'CopeSession',
  copeSignLink: 'CopeSignLink',
  copingStrategy: 'CopingStrategy',
  diary: 'Diary',
  diarySession: 'DiarySession',
  distractContactLink: 'DistractContactLink',
  distraction: 'Distraction',
  prepopSafetyPlan: 'PrepopSafetyPlan',
  reason: 'Reason',
  schedule: 'Schedule',
  session: 'Session',
  signSession: 'SignSession',
  user: 'User',
  warningSign: 'WarningSign',
};

// DB Primary Key column names
export const DbPrimaryKeys = {
  function: 'functionId',
  usage: 'usageId',
  contact: 'contactId',
  copingStrategy: 'copeId',
  diary: 'diaryId',
  distraction: 'distractId',
  prepopSafetyPlan: 'prepopId',
  reason: 'reasonId',
  schedule: 'scheduleId',
  session: 'sessionId',
  user: 'userId',
  warningSign: 'signId',
};

// Usage function id's
export const UsageFunctionIds = {
  view: {
    warningSign: 1,
    copingStrategy: 2,
    distraction: 3,
    reason: 4,
    contact: 5,
    environment: 6,
  },
  latest: {
    warningSign: 7,
    copingStrategy: 8,
    distraction: 9,
    reason: 10,
    contact: 11,
    environment: 12,
  },
};
