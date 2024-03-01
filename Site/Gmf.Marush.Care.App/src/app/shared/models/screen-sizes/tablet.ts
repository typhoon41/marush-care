import { Size } from './size';

export class TabletSize extends Size {
    readonly supportsMenu = false;
    readonly name = 'tablet';
}
