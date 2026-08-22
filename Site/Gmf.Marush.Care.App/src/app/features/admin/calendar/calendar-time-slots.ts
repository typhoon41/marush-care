import { IComboBoxItem } from '@shared/components/forms/combobox/item';

const slotsPerHour = 4;
const minutesPerSlot = 15;
const minutesPerHour = 60;
const zeroPad = 2;
const startHour = 11;
const endHour = 22;

const toTime = (slotIndex: number): string => {
    const totalMinutes = startHour * minutesPerHour + slotIndex * minutesPerSlot;
    const hours = Math.floor(totalMinutes / minutesPerHour);
    const minutes = totalMinutes % minutesPerHour;
    return `${hours.toString().padStart(zeroPad, '0')}:${minutes.toString().padStart(zeroPad, '0')}`;
};

const slotCount = (endHour - startHour) * slotsPerHour;

const allOptions: IComboBoxItem[] = Array.from({ length: slotCount + 1 },
    (_, slotIndex) => ({ value: toTime(slotIndex), label: toTime(slotIndex) }));

/** The quarter-hour grid the calendar is laid out on, and the times it accepts. */
export class CalendarTimeSlots {
    static readonly count = slotCount;

    static readonly all = Array.from({ length: slotCount }, (_, slotIndex) => ({
        index: slotIndex,
        time: toTime(slotIndex),
        label: slotIndex % slotsPerHour === 0 ? toTime(slotIndex) : '',
        endsHour: (slotIndex + 1) % slotsPerHour === 0
    }));

    // The last slot is a valid end but never a valid start, and the first is the reverse.
    static readonly startOptions = allOptions.slice(0, slotCount);
    static readonly endOptions = allOptions.slice(1);

    static toTime = toTime;

    static toSlotIndex = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return (hours - startHour) * slotsPerHour + Math.floor(minutes / minutesPerSlot);
    };

    static clampToGrid = (slotIndex: number): number => Math.min(Math.max(slotIndex, 0), slotCount);

    static findOption = (value?: string): IComboBoxItem | undefined =>
        allOptions.find(option => option.value === value);
}
