import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { CoreService } from './core.service';
import { DataHandlerService } from './data-handler.service';

import { DataProviderMockService } from './data-provider-mock.service';
import { DataProviderService } from './data-provider.service';

import { environment } from 'environments/environment';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, BrowserAnimationsModule, MatSliderModule, HttpModule],
    providers: [CoreService, DataHandlerService, 
        { provide: DataProviderService, useClass: environment.mock ? DataProviderMockService : DataProviderService }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
