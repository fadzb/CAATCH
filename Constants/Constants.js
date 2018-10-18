// Safety Plan
export const SafetyPlanConstants = {
    distraction: 'Distraction',
    randomSkill: 'RandomSkill',
    copingStrategy: 'CopingStrategy',
    warningSign: 'WarningSign'
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
    helper: 'Helper',
    goal: 'Goal'
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
    helper: 'helperId'
};

// Section Headers
export const SectionHeader = {
    plan: 'My Safety Plan',
    diary: 'My Diary',
    stats: 'My Stats',
    signs: 'My Warning Signs',
    strategies: 'My Coping Strategies',
    contacts: 'My Contacts',
    shortPlan: 'My Plan',
    skills: 'DBT Skills',
    info: 'DBT Info',
    helpers: 'My Helpers',
    goals: 'My Goals'
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
        helper: 19,
    },
    lastEntered: {
        warningSign: 7,
        copingStrategy: 8,
        distraction: 9,
        reason: 10,
        contact: 11,
        environment: 12,
        helper: 20,
    },
    lastViewed: {
        warningSign: 13,
        copingStrategy: 14,
        distraction: 15,
        reason: 16,
        contact: 17,
        environment: 18,
        helper: 21
    },
    session: {
        statSelection: 22,
        Plan: 23,
        Diary: 24,
        goals: 25,
        reports: 26
    }
};

// Diary ID's
export const DiaryId = {
    usedSkills: 27,
    notes: 29,
    sleep: 28,
    mood: 30,
    steps: 47
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
    'Didn’t try, used them, helped'
];