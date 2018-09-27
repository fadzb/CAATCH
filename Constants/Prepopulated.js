// function for retrieving Pre-populated Content from DB

import {readDatabase} from "../Util/DatabaseHelper";
import store from "../Redux/store"
import {resetFeelingRating, resetSkillRating} from "../Redux/actions";

// SafetyPlan

export const getPrePops = () => {
    readDatabase('*',
        'PrepopSafetyPlan',
        p => safetyPlanPrePops = p.map(t => ({name: t.prepopName, category: t.prepopCategory, icon: t.icon})))
};

export let safetyPlanPrePops = [];

// Diary

export const getDiaryPrePops = () => {
    readDatabase('*',
        'Diary',
        d => {
            diaryPrePops = d;

            store.dispatch(resetSkillRating(d.filter(t => t.diaryType === "Skill").map(s => ({id: s.diaryId, rating: 0}))))
            store.dispatch(resetFeelingRating(d.filter(t => t.diaryType === "Feeling").map(f => ({id: f.diaryId, rating: 0}))))
        })
};

export let diaryPrePops = [];