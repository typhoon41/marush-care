import { environment } from '@env';

class MarushDetails {
    readonly phoneNumber = '060/522-95-93';
    readonly phoneNumberAction = 'tel:+381605229593';
    readonly email = 'office@marushcare.com';
    readonly emailAction = 'mailto:office@marushcare.com';

    readonly phoneContact = () => {
        window.open(this.phoneNumberAction, '_self');
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
