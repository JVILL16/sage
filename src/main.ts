/// <reference types="@angular/localize" />

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { LoadingComponent} from './app/service/loading/loading.component';


if (environment.production) {
  enableProdMode();
  console.log = function(): void {}; //this is where we cancel all logs 
}

// platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {
//   // Ensure Angular destroys itself on hot reloads.
//   if (window['ngRef']) {
//     window['ngRef'].destroy();
//   }
//   window['ngRef'] = ref;

//   // Otherwise, log the boot error
// }).catch(err => console.error(err));

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
