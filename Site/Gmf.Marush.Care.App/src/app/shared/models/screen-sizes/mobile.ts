import { Size } from './size';

export class MobileSize extends Size {
    readonly supportsMenu = true;
    readonly name = 'mobile';
}
