// function for retrieving Pre-populated Safety Plan Content

import {readDatabase} from "../Util/DatabaseHelper";

export const getPrePops = () => {
    readDatabase('*',
        'PrepopSafetyPlan',
        p => safetyPlanPrePops = p.map(t => ({name: t.prepopName, category: t.prepopCategory})))
};

export let safetyPlanPrePops = [];