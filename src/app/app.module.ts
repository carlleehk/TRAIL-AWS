import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';

import { StarRatingModule} from 'angular-star-rating';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    StarRatingModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
