import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { CoreService } from './core.service';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule],
    providers: [CoreService],
    bootstrap: [AppComponent]
})
export class AppModule {}
