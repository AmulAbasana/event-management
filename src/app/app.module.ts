import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { EventDataProvider } from '../providers/event-data/event-data';
import { HttpServiceProvider } from '../providers/http-service/http-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UtilitiesProvider } from '../providers/utilities/utilities';
import { ViewEventPage } from '../pages/view-event/view-event';
import { CreateEventPage } from '../pages/create-event/create-event';
import { ComponentsModule } from '../components/components.module';
import { EditEventPage } from '../pages/edit-event/edit-event';

@NgModule({
  declarations: [
    MyApp,
    EditEventPage,
    ViewEventPage,
    CreateEventPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    EditEventPage,
    ViewEventPage,
    CreateEventPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClient,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    EventDataProvider,
    HttpServiceProvider,
    UtilitiesProvider
  ]
})
export class AppModule {}
