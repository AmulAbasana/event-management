import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
	selector: 'page-edit-event',
	templateUrl: 'edit-event.html',
})
export class EditEventPage {

	index : number;
	eventData : any;
	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.index = this.navParams.get('index');
		this.eventData = this.navParams.get('updatedEventData');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad EditEventPage');
	}
}
