export const daysInWeek = 7;

export const mondayOf = (date: Date): string => {
    const monday = new Date(date);
    const dayOfWeek = monday.getDay();
    const daysFromMonday = dayOfWeek === 0 ? daysInWeek - 1 : dayOfWeek - 1;
    monday.setDate(monday.getDate() - daysFromMonday);
    return monday.toISOString().split('T')[0];
};

export const addDays = (isoDate: string, days: number): string => {
    const result = new Date(isoDate);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
};
