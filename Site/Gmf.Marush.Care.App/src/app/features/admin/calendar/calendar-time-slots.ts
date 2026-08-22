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
    endsHour: (slotIndex + 1) % slotsPerHour === 0
}));

const toTimeOption = (slotIndex: number): { value: string; label: string } => {
    const time = slotIndexToTime(slotIndex);
    return { value: time, label: time };
};

export const timeOptions = Array.from({ length: slotsCount + 1 }, (_, slotIndex) => toTimeOption(slotIndex));

// The last slot is a valid end but never a valid start, and the first is the reverse.
export const startTimeOptions = timeOptions.slice(0, slotsCount);
export const endTimeOptions = timeOptions.slice(1);
