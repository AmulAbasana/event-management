import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EventDataProvider } from '../../providers/event-data/event-data';
import { EditEventPage } from '../edit-event/edit-event';

@Component({
	selector: 'page-view-event',
	templateUrl: 'view-event.html',
})
export class ViewEventPage {

	eventList = new Array();
	constructor(private navCtrl: NavController, private navParams: NavParams,private evenDataProvider : EventDataProvider) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ViewEventPage');
		this.evenDataProvider.latestEventData.subscribe(({ latestData }) => {
			console.log("Got new value : ",latestData);
			this.eventList = latestData;
		});
	}

	ionViewDidEnter(){
		this.eventList = this.evenDataProvider.getEventData();
	}

	deleteEvent(index){
		if (index > -1) {
			this.eventList.splice(index, 1);
			this.evenDataProvider.deleteEventData(index);
		}

	}

	updateEvent(index : number,updatedEventData : any){
		this.navCtrl.push(EditEventPage,{'index': index, 'updatedEventData' : updatedEventData});
	}

}
