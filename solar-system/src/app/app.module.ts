import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material';


import { AppComponent } from './app.component';

import { CoreService } from './core.service';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, BrowserAnimationsModule, MatSliderModule],
    providers: [CoreService],
    bootstrap: [AppComponent]
})
export class AppModule {}
