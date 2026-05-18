export const SLOT_HEIGHT = 36;
export const CALENDAR_START_HOUR = 11;
export const CALENDAR_END_HOUR = 22;
export const DAYS_IN_WEEK = 7;

const SLOTS_PER_HOUR = 4;
const MINUTES_PER_SLOT = 15;
const MINUTES_PER_HOUR = 60;
const ZERO_PAD = 2;

export const SLOTS_COUNT = (CALENDAR_END_HOUR - CALENDAR_START_HOUR) * SLOTS_PER_HOUR;

export const timeToSlotIndex = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours - CALENDAR_START_HOUR) * SLOTS_PER_HOUR + Math.floor(minutes / MINUTES_PER_SLOT);
};

export const slotIndexToTime = (slotIndex: number): string => {
    const totalMinutes = CALENDAR_START_HOUR * MINUTES_PER_HOUR + slotIndex * MINUTES_PER_SLOT;
    const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
    const minutes = totalMinutes % MINUTES_PER_HOUR;
    return `${hours.toString().padStart(ZERO_PAD, '0')}:${minutes.toString().padStart(ZERO_PAD, '0')}`;
};

export const timeSlots = Array.from({ length: SLOTS_COUNT }, (_, slotIndex) => ({
    index: slotIndex,
    time: slotIndexToTime(slotIndex),
    label: slotIndex % SLOTS_PER_HOUR === 0 ? slotIndexToTime(slotIndex) : '',
    isHour: slotIndex % SLOTS_PER_HOUR === 0
}));

export const mondayOf = (date: Date): string => {
    const monday = new Date(date);
    const dayOfWeek = monday.getDay();
    const daysFromMonday = dayOfWeek === 0 ? DAYS_IN_WEEK - 1 : dayOfWeek - 1;
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
    Array.from({ length: SLOTS_COUNT + 1 }, (_, slotIndex) => {
        const time = slotIndexToTime(Math.min(slotIndex, SLOTS_COUNT));
        return { value: time, label: time };
    });
