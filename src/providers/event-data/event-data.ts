import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EventDataProvider {

	public latestEventData : Subject <any> = new Subject();
	constructor() {
		console.log('Hello EventDataProvider Provider');
	}

	setEventData(data: any) {
		let eventData = JSON.parse(localStorage.getItem("eventData"));
		if(eventData){
			eventData[eventData.length] = data;
			localStorage.setItem("eventData",JSON.stringify(eventData));
			this.latestEventData.next ({latestData : eventData});
		}else{
			let value = [data];
			localStorage.setItem("eventData",JSON.stringify(value))
			this.latestEventData.next ({latestData : value});
		}
		
	}

	getEventData(){
		return JSON.parse(localStorage.getItem("eventData"));
	}

	deleteEventData(index : number){
		let eventData = JSON.parse(localStorage.getItem("eventData"));
		if(eventData){
			eventData.splice(index, 1);
			localStorage.setItem("eventData",JSON.stringify(eventData));
			this.latestEventData.next ({latestData : eventData});
		}
	}

	updateEventData(index : number,updatedValue : any){
		let eventData = JSON.parse(localStorage.getItem("eventData"));
		if(eventData){
			eventData[index] = updatedValue;
			localStorage.setItem("eventData",JSON.stringify(eventData));
			this.latestEventData.next ({latestData : eventData});
		}
	}
}
