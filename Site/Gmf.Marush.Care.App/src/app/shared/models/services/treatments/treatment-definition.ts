import { Money } from '@shared/pipes/money';

type RequiredProperties = 'title' | 'name' | 'duration' | 'price';

export class TreatmentDefinition {
  title!: string;
  name!: string;
  duration!: number;
  price!: number;
  description?: string;
  showDuration?: boolean;
  rangedDuration?: string;
  clone?: boolean;
  rangedPrice?: string;

  static readonly minutesLabel = $localize`:@@minutes: minuta`;

  constructor(data: Required<Pick<TreatmentDefinition, RequiredProperties>> &
    Partial<Omit<TreatmentDefinition, RequiredProperties>>) {
    Object.assign(this, data);
  }

  readonly titleWithDuration = () => this.title + (this.showDuration ? ` (${this.duration + TreatmentDefinition.minutesLabel})` : '');

  readonly descriptionWithPricedDuration = () =>
    // eslint-disable-next-line @stylistic/max-len
    `${this.description || ''}${this.description ? '<br><br>' : ''}${$localize`:@@services.treatments.price:Cena osnovne usluge: ${this.rangedPrice ?
      this.rangedPrice : new Money().transform(this.price)}`
    }<br><br>${$localize`:@@services.treatments.duration:Okvirno vreme trajanja usluge: ${this.rangedDuration ?
      this.rangedDuration : this.duration}`
    }${$localize`:@@minutes: minuta`}`;

  readonly formattedPrice = () => new Money().transform(this.price);
}
