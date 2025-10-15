import { environment } from '@env';

class MarushDetails {
    readonly phoneNumber = '060/522-95-93';
    readonly phoneNumberAction = 'tel:+381605229593';
    readonly email = 'office@marushcare.com';
    readonly emailAction = 'mailto:office@marushcare.com';
    readonly name = 'Marush: Space of Care';

    readonly phoneContact = () => {
        window.open(this.phoneNumberAction, '_self');
    };

    readonly openPriceList = () => {
        window.open(this.priceListUrl());
    };

    readonly priceListUrl = () => {
        const fileName = $localize`:@@pricelist:cenovnik | PDF`;
        const suffixLength = 6;
        return `${environment.staticContentUrl}${fileName.slice(0, -suffixLength)}.pdf`;
    };
}

const marushDetails = new MarushDetails();
export default marushDetails;
