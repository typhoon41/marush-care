export type OptionalKeyboardEvent = KeyboardEvent | null | undefined;

export const isAction = (event: OptionalKeyboardEvent) => !event || event.key === 'Enter' || event.key === ' ';

export const isCancel = (event: OptionalKeyboardEvent) => !!event && event.key === 'Escape';
