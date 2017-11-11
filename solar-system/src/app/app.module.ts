import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { environment } from 'environments/environment';

import { setAppInjector } from './helpers/app-injector';
import { AppComponent } from './app.component';

import { SolarLogger } from './logger.service';
import { CoreService } from './core.service';
import { DataHandlerService } from './data-handler.service';
import { DataProviderMockService } from './data-provider-mock.service';
import { DataProviderService } from './data-provider.service';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, BrowserAnimationsModule, MatSliderModule, HttpModule],
    providers: [CoreService, DataHandlerService, SolarLogger, 
        { provide: DataProviderService, useClass: environment.mock ? DataProviderMockService : DataProviderService }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    // I know it's anti pattern but this is the only solution I found
    // to inject my logger into TS classes with constructor arguments
    constructor(injector: Injector) {
        setAppInjector(injector);
    }
}
