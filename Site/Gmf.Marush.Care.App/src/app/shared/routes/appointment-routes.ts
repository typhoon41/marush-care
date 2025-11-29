import { lazyRoute } from './routes';

export class AppointmentRoutes {
    readonly routes = [
        lazyRoute('appointment', $localize`:@@routes.appointment:zakazivanje`,
            () => import('@features/appointment/appointment-page').then(mod => mod.AppointmentPage)),
        lazyRoute('request-sent', $localize`:@@routes.appointment.requested:zahtev-poslat`,
            () => import('@features/appointment/request-sent/request-sent-page')
                .then(mod => mod.RequestSentPage)),
        lazyRoute('client-notified', 'klijent-obavešten',
            () => import('@features/appointment/client-notified/client-notified-page')
                .then(mod => mod.ClientNotifiedPage))
    ];
}
