// The unit-test builder compiles with localize disabled, so $localize is initialised before any spec imports app code.
// Messages then resolve to their Serbian source text, which is what the specs assert.
import '@angular/localize/init';
