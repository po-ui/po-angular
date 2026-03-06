import { InjectionToken } from '@angular/core';

import { PoTelemetryConfig } from './po-telemetry-config.interface';

export const PO_TELEMETRY_CONFIG = new InjectionToken<PoTelemetryConfig>('PO_TELEMETRY_CONFIG');
