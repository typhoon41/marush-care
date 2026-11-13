import { HttpContextToken } from '@angular/common/http';

/**
 * The response statuses a request's caller explains to the user itself. The error interceptor
 * rethrows those to the caller instead of treating them as a system failure.
 */
export const callerHandledStatuses = new HttpContextToken<readonly number[]>(() => []);
