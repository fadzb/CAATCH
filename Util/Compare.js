// function(s) used for sorting SP items

export const compareDates = (item1, item2) => {
    if(item1.dateEntered > item2.dateEntered) {
        return -1;
    } else if (item1.dateEntered < item2.dateEntered) {
        return 1;
    } else {
        return 0;
    }
};
