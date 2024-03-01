import { DesktopSize } from './desktop';
import { MobileSize } from './mobile';
import { Size } from './size';
import { TabletSize } from './tablet';

export class ScreenSizeFactory {
    private static readonly availableSizes: Size[] = [
        new MobileSize(), new TabletSize(), new DesktopSize()];

    static readonly createFrom = (givenSize: string): Size => {
        const sizeFound = this.availableSizes.filter(size => size.name.includes(givenSize))[0];
        if (!sizeFound) {
            throw new Error(`Cannot map screen size to '${givenSize}'.`);
        }

        return sizeFound;
    };
}
