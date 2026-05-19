export const slotHeight = 36;
export const calendarStartHour = 11;
export const calendarEndHour = 22;
export const daysInWeek = 7;

const slotsPerHour = 4;
const minutesPerSlot = 15;
const minutesPerHour = 60;
const zeroPad = 2;

export const slotsCount = (calendarEndHour - calendarStartHour) * slotsPerHour;

export const timeToSlotIndex = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours - calendarStartHour) * slotsPerHour + Math.floor(minutes / minutesPerSlot);
};

export const slotIndexToTime = (slotIndex: number): string => {
    const totalMinutes = calendarStartHour * minutesPerHour + slotIndex * minutesPerSlot;
    const hours = Math.floor(totalMinutes / minutesPerHour);
    const minutes = totalMinutes % minutesPerHour;
    return `${hours.toString().padStart(zeroPad, '0')}:${minutes.toString().padStart(zeroPad, '0')}`;
};

export const timeSlots = Array.from({ length: slotsCount }, (_, slotIndex) => ({
    index: slotIndex,
    time: slotIndexToTime(slotIndex),
    label: slotIndex % slotsPerHour === 0 ? slotIndexToTime(slotIndex) : '',
    isHour: slotIndex % slotsPerHour === 0
}));

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

export const formatMoney = (amount: number): string =>
    amount.toLocaleString('sr-RS', { maximumFractionDigits: 0 });

export const generateTimeOptions = (): { value: string; label: string }[] =>
    Array.from({ length: slotsCount + 1 }, (_, slotIndex) => {
        const time = slotIndexToTime(Math.min(slotIndex, slotsCount));
        return { value: time, label: time };
    });
