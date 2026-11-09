import { IComboBoxItem } from '@shared/components/forms/combobox/item';
import { TwoDigits } from './two-digits';

const slotsPerHour = 4;
const minutesPerSlot = 15;
const minutesPerHour = 60;
const startHour = 11;
const endHour = 22;

/** The quarter-hour grid the calendar is laid out on, and the times it accepts. */
export class CalendarTimeSlots {
    static readonly count = (endHour - startHour) * slotsPerHour;

    /** The slot index used when no slot is chosen; typed wide so signals holding it accept real indexes. */
    static readonly unset: number = -1;

    static readonly toTime = (slotIndex: number): string => {
        const totalMinutes = startHour * minutesPerHour + slotIndex * minutesPerSlot;
        const hours = Math.floor(totalMinutes / minutesPerHour);
        const minutes = totalMinutes % minutesPerHour;
        return `${TwoDigits.of(hours)}:${TwoDigits.of(minutes)}`;
    };

    static readonly toSlotIndex = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return (hours - startHour) * slotsPerHour + Math.floor(minutes / minutesPerSlot);
    };

    static readonly clampToGrid = (slotIndex: number): number =>
        Math.min(Math.max(slotIndex, 0), CalendarTimeSlots.count);

    static readonly findOption = (value?: string): IComboBoxItem | undefined =>
        CalendarTimeSlots.options.find(option => option.value === value);

    // One time per slot boundary, so one more than there are slots.
    private static readonly times = Array.from({ length: CalendarTimeSlots.count + 1 },
        (_, slotIndex) => CalendarTimeSlots.toTime(slotIndex));

    private static readonly options: IComboBoxItem[] = CalendarTimeSlots.times.map(time => ({ value: time, label: time }));

    static readonly all = CalendarTimeSlots.times.slice(0, CalendarTimeSlots.count).map((time, slotIndex) => ({
        index: slotIndex,
        time,
        label: slotIndex % slotsPerHour === 0 ? time : '',
        endsHour: (slotIndex + 1) % slotsPerHour === 0
    }));

    // The last slot is a valid end but never a valid start, and the first is the reverse.
    static readonly startOptions = CalendarTimeSlots.options.slice(0, CalendarTimeSlots.count);
    static readonly endOptions = CalendarTimeSlots.options.slice(1);
}
