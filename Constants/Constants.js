// Safety Plan
export const SafetyPlanConstants = {
  distraction: 'Distraction',
  randomSkill: 'RandomSkill',
  copingStrategy: 'CopingStrategy',
  warningSign: 'WarningSign',
};

// SB table names for SP components. Used to query data for reports
export const SafetyPlanDbTables = {
  warningSign: {
    tableName: 'WarningSign',
    title: 'Warning Signs',
    dbNameColumn: 'signName',
    delete: 'dateDeleted',
    reportTitle: 'Step 1: Warning signs (thoughts, images, mood, situation, behavior) that a crisis may be developing:',
  },
  copingStrategy: {
    tableName: 'CopingStrategy',
    title: 'Coping Strategies',
    dbNameColumn: 'copeName',
    delete: 'dateDeleted',
    reportTitle:
      'Step 2: Internal coping strategies – Things I can do to take my mind off my problems without contacting another person (relaxation technique, physical activity):',
  },
  distraction: {
    tableName: 'Distraction',
    title: 'Things to Do',
    dbNameColumn: 'distractName',
    delete: 'dateDeleted',
    reportTitle: 'Step 3: People and social settings that provide distraction:',
  },
  reason: {
    tableName: 'Reason',
    title: 'Life Worth Living',
    dbNameColumn: 'reasonName',
    delete: 'dateDeleted',
    reportTitle: 'Step 4: Things that are important to me and worth living for:',
  },
  contact: {
    tableName: 'Contact',
    title: 'My Network',
    dbNameColumn: 'firstName',
    delete: 'dateDeleted',
    reportTitle: 'Step 5: People whom I can ask for help:',
  },
  environment: {
    tableName: 'environment',
    title: 'Making the Environment Safe',
    dbNameColumn: 'environmentName',
    delete: 'dateDeleted',
    reportTitle: 'Step 6: Making the environment safe:',
  },
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
  environment: 'Environment',
  goal: 'Goal',
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
  environment: 'environmentId',
};

// Section Headers
export const SectionHeader = {
  plan: 'My Safety Plan',
  diary: 'My Diary',
  stats: 'My Stats',
  signs: 'My Warning Signs',
  strategies: 'My Coping Strategies',
  contacts: 'My Network',
  shortPlan: 'My Plan',
  skills: 'DBT Skills',
  info: 'DBT Diary',
  goals: 'My Goals',
};

// Usage function id's
export const UsageFunctionIds = {
  mostViewed: {
    warningSign: 1,
    copingStrategy: 2,
    distraction: 3,
    reason: 4,
    contact: 5,
    environment: 6,
  },
  lastEntered: {
    warningSign: 7,
    copingStrategy: 8,
    distraction: 9,
    reason: 10,
    contact: 11,
    environment: 12,
  },
  lastViewed: {
    warningSign: 13,
    copingStrategy: 14,
    distraction: 15,
    reason: 16,
    contact: 17,
    environment: 18,
  },
  session: {
    statSelection: 22,
    Plan: 23,
    Diary: 24,
    goals: 25,
    reportSelection: 26,
  },
};

// Diary ID's
export const DiaryId = {
  usedSkills: 27,
  notes: 29,
  sleep: 28,
  mood: 30,
  steps: 47,
};

// Skill Groups
export const SkillGroups = {
  1: 'Mindfulness',
  2: 'Interpersonal Effectiveness',
  3: 'Emotion Regulation',
  4: 'Distress Tolerance',
};

// Used Skill Rating
export const UsedSkillRating = [
  'Not thought about or used',
  'Thought about, not used, didn’t want to',
  'Thought about, not used, wanted to',
  'Tried but couldn’t use them',
  'Tried, could do them but they didn’t help',
  'Tried, could use them, helped',
  'Didn’t try, used them, didn’t help',
  'Didn’t try, used them, helped',
];
