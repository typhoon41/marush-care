import { environment } from '@env';

class MarushDetails {
    readonly phoneNumber = 'tel:+381605229593';

    readonly phoneContact = () => {
        window.open(this.phoneNumber, '_self');
    };

    readonly openPriceList = () => {
        window.open(this.priceListUrl());
    };

    readonly priceListUrl = () => {
        const fileName = $localize`:@@pricelist:cenovnik`;
        return `${environment.staticContentUrl}${fileName}.pdf`;
    };
}

const marushDetails = new MarushDetails();
export default marushDetails;
