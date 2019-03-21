import { Component } from '@angular/core';
import { ViewEventPage } from '../view-event/view-event';
import { CreateEventPage } from '../create-event/create-event';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = CreateEventPage;
  tab2Root = ViewEventPage;

  constructor() {

  }
}
