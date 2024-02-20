import { Size } from './size';

export class DesktopSize extends Size {
    readonly supportsMenu = false;
    readonly name = 'desktop';
}
