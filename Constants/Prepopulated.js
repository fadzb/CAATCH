// function for retrieving Pre-populated Content from DB

import { readDatabase } from '../Util/DatabaseHelper';

// SafetyPlan

export const getPrePops = () => {
  readDatabase(
    '*',
    'PrepopSafetyPlan',
    (p) => (safetyPlanPrePops = p.map((t) => ({ name: t.prepopName, category: t.prepopCategory })))
  );
};

export let safetyPlanPrePops = [];

// Diary

export const getDiaryPrePops = () => {
  readDatabase('*', 'Diary', (d) => (diaryPrePops = d));
};

export let diaryPrePops = [];
