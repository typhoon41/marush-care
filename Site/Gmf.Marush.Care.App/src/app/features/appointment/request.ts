import { FormControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { TreatmentDefinition } from '@shared/models/services/treatments/treatment-definition';

export interface AppointmentRequest {
    name: string;
    surname: string;
    email: string;
    phone: string;
    treatments: string[];
    serbianTreatments: string[];
    sum: number;
    date: string;
    time: string;
    duration: number;
}

const defaultFieldLength = 100;
export const requestFormWith = (formBuilder: NonNullableFormBuilder) => formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(defaultFieldLength)]),
      surname: new FormControl('', [Validators.required, Validators.maxLength(defaultFieldLength)]),
      email: new FormControl('', [Validators.required, Validators.maxLength(defaultFieldLength), Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/(06\d{7,8})|(\+\d{10,13})/u)]),
      date: new FormControl('', [Validators.required]),
      time: new FormControl(''),
      treatments: new FormControl([]),
      serbianTreatments: new FormControl([]),
      timeGroup: formBuilder.group({
        time: new FormControl('', [Validators.required])
      }),
      duration: new FormControl(0, []),
      checkedServices: formBuilder.array<TreatmentDefinition>([]),
      sum: new FormControl(0)
    }, { updateOn: 'blur' });
