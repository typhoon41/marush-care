export const daysInWeek = 7;
export const workingDaysInWeek = 6;

const padToTwoDigits = 2;

const toLocalIsoDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString()
        .padStart(padToTwoDigits, '0');
    const day = date.getDate().toString()
        .padStart(padToTwoDigits, '0');
    return `${year}-${month}-${day}`;
};

export const mondayOf = (date: Date): string => {
    const monday = new Date(date);
    const dayOfWeek = monday.getDay();
    const daysFromMonday = dayOfWeek === 0 ? daysInWeek - 1 : dayOfWeek - 1;
    monday.setDate(monday.getDate() - daysFromMonday);
    return toLocalIsoDate(monday);
};

export const addDays = (isoDate: string, days: number): string => {
    const [year, month, day] = isoDate.split('-').map(Number);
    const result = new Date(year, month - 1, day);
    result.setDate(result.getDate() + days);
    return toLocalIsoDate(result);
};

export const toSerbianDate = (isoDate: string): string => {
    const [year, month, day] = isoDate.split('-');
    return `${parseInt(day, 10)}.${parseInt(month, 10)}.${year}.`;
};

export const fromSerbianDate = (serbianDate: string): string => {
    const [day, month, year] = serbianDate.split('.');
    return `${year}-${month.padStart(padToTwoDigits, '0')}-${day.padStart(padToTwoDigits, '0')}`;
};
