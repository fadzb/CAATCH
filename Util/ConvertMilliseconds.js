
export const convertMilliseconds = duration => {
    const minutes = Number.parseFloat((duration / 1000) / 60).toFixed(1);
    const hours = Number.parseFloat((duration / 1000) / 60 / 60).toFixed(1);
    const days = parseInt((duration / 1000) / 60 / 60 / 24);

    if(minutes < 60) {
        return minutes + 'm'
    } else if (hours < 24) {
        return hours + 'h'
    } else {
        return days + 'd'
    }

};