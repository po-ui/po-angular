import { ɵsetUnknownElementStrictMode, ɵsetUnknownPropertyStrictMode } from '@angular/core';

// Disable Angular runtime validation for unknown elements/properties (NG0303/NG0304)
// This is needed because tests declare components without importing all their dependencies
ɵsetUnknownElementStrictMode(false);
ɵsetUnknownPropertyStrictMode(false);

export default [];
