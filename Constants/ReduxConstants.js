export const defaultSkillRating = () => {

    const arr = [];

    for (let i = 1; i <= 18; i++) {
        arr.push({id: i, rating: 'No'})
    }

    return arr;
};

export const defaultFeelingRating = () => {

    const arr = [];

    for (let i = 19; i <= 27; i++) {
        arr.push({id: i, rating: 0})
    }

    return arr;
};