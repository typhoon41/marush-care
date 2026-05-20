export const slotHeight = 36;
export const calendarStartHour = 11;
export const calendarEndHour = 22;

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

export const generateTimeOptions = (): { value: string; label: string }[] =>
    Array.from({ length: slotsCount + 1 }, (_, slotIndex) => {
        const time = slotIndexToTime(Math.min(slotIndex, slotsCount));
        return { value: time, label: time };
    });

export const timeOptions = generateTimeOptions();
