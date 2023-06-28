export const isValidTime = (hour, minute) => {
    return hour >= 0 && hour <= 24 && minute >= 0 && minute < 60 && hour && minute;
};

export const isValidTaskNumber = (taskNumber) => {
    return parseInt(taskNumber, 10) === taskNumber && parseInt(taskNumber, 10) >= 1;
};
