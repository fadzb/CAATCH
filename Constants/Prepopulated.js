// function for retrieving Pre-populated Content from DB

import {readDatabase, readDatabaseArg} from "../Util/DatabaseHelper";
import store from "../Redux/store"
import {resetFeelingRating, resetSkillRating} from "../Redux/actions";
import {DbTableNames} from "./Constants";

// SafetyPlan

export const getPrePops = () => {
    readDatabase('*',
        DbTableNames.prepopSafetyPlan,
        p => safetyPlanPrePops = p.map(t => ({name: t.prepopName, category: t.prepopCategory, icon: t.icon})))
};

export let safetyPlanPrePops = [];

// Diary

export const getDiaryPrePops = () => {
    readDatabase('*',
        DbTableNames.diary,
        d => {
            diaryPrePops = d;

            store.dispatch(resetSkillRating(d.filter(t => t.diaryType === "Skill").map(s => ({id: s.diaryId, rating: 0}))));
            store.dispatch(resetFeelingRating(d.filter(t => t.diaryType === "Feeling").map(f => ({id: f.diaryId, rating: 0}))))
        })
};

export const updateDiaryPrePops = (func) => {
    readDatabase('*',
        DbTableNames.diary,
        d => {
            diaryPrePops = d;

            func()
        })
};

export let diaryPrePops = [];