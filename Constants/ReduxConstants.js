export const defaultSkillRating = () => {
  const arr = [];

  for (let i = 1; i <= 18; i++) {
    arr.push({ id: i, rating: 'No' });
  }

  return arr;
};
