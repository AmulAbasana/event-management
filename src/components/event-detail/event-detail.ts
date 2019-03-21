import { Component, Input } from '@angular/core';
import { NavController, Keyboard } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { EventDataProvider } from '../../providers/event-data/event-data';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UtilitiesProvider } from '../../providers/utilities/utilities';

@Component({
	selector: 'event-detail',
	templateUrl: 'event-detail.html',
	providers: [
        HttpServiceProvider,
		UtilitiesProvider,
		EventDataProvider
    ]
})
export class EventDetailComponent {

	@Input() flowName : string; // two possible values 1.create event flow 2. edit event flow
	@Input() eventData ?: any;
	@Input() indexOfEventData : number;

	invitedEmailIds = [];

	createEventFormGroup: FormGroup;
	locations = new Array();
	minEventStartDate : string;
	minEventStartTime : string;
	minEventEndDate : string;
	minEventEndTime : string;

	constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public evenDataProvider: EventDataProvider,private keyboard: Keyboard,public httpServiceProvider: HttpServiceProvider,public utilitiesProvider : UtilitiesProvider) {

		this.createEventFormGroup = this.formBuilder.group({
			eventTitle: new FormControl("", Validators.required),
			eventStartDate: new FormControl("", Validators.required),
			eventStartTime: new FormControl("",Validators.required),
			eventEndDate: new FormControl("", Validators.required),
			eventEndTime: new FormControl("",Validators.required),
			eventForAllDay: new FormControl(false),
			eventLocation: new FormControl("", Validators.required),
			eventEmailId: new FormControl("", Validators.compose([Validators.required,Validators.pattern("^[a-z0-9.]+@[a-z0-9]+\.[a-z]{2,4}$")])),
			eventDescription: new FormControl("", Validators.required),
			guestEmailId: new FormControl("",Validators.pattern("^[a-z0-9.]+@[a-z0-9]+\.[a-z]{2,4}$"))
		});
		this.minEventStartDate = this.formatDate(new Date());
		this.minEventStartTime = this.formatTime(new Date());
		this.minEventEndDate = this.formatDate(new Date());
		this.minEventEndTime = this.formatTime(new Date());
	}

	ngAfterViewInit(){
		console.log("eventData : ",this.eventData);
		console.log("flowName : ",this.flowName);
		console.log("indexOfEventData : ",this.indexOfEventData);
		if(this.flowName.toLowerCase() === "update"){
			console.log("eventData : ",this.eventData);
			this.createEventFormGroup.patchValue({
				eventTitle: this.eventData.title,
				eventStartDate: this.eventData.startDate,
				eventStartTime: this.eventData.startTime,
				eventEndDate: this.eventData.endDate,
				eventEndTime: this.eventData.endTime,
				eventForAllDay: this.eventData.isEventForAllDay,
				eventLocation: this.eventData.location,
				eventEmailId: this.eventData.emailId,
				eventDescription: this.eventData.description
			});
			this.invitedEmailIds = this.eventData.guestEmailIds;
			this.allDayEventValueChanged();
		}
	}

	submitForm() {
		console.log("Form Value: ", this.createEventFormGroup);
		if (this.createEventFormGroup.valid && this.invitedEmailIds.length != 0) {
			let data = {
				'title': this.createEventFormGroup.controls.eventTitle.value,
				'startDate': this.createEventFormGroup.controls.eventStartDate.value,
				'startTime': this.createEventFormGroup.controls.eventStartTime.value,
				'isEventForAllDay' : this.createEventFormGroup.controls.eventForAllDay.value,
				'endDate': this.createEventFormGroup.controls.eventEndDate.value,
				'endTime': this.createEventFormGroup.controls.eventEndTime.value,
				'location': this.createEventFormGroup.controls.eventLocation.value,
				'emailId': this.createEventFormGroup.controls.eventEmailId.value,
				'description': this.createEventFormGroup.controls.eventDescription.value,
				'guestEmailIds': this.invitedEmailIds,
			};
			if(this.flowName.toLowerCase() === "update"){
				this.evenDataProvider.updateEventData(this.indexOfEventData,data);
				this.utilitiesProvider.showAlert("Success","Event details updated successfully");
			}	
			else{
				this.evenDataProvider.setEventData(data);
				this.createEventFormGroup.reset();
				this.utilitiesProvider.showAlert("Success","Event created successfully");
			}
		}else{
			this.utilitiesProvider.showAlert("Error","Please fill correct information");
		}
	}
	addGuest() {
		if(this.createEventFormGroup.controls.guestEmailId.valid){
			this.invitedEmailIds.push(this.createEventFormGroup.controls.guestEmailId.value);
			this.createEventFormGroup.patchValue({guestEmailId : ''});
		}else{
			this.utilitiesProvider.showAlert("Error","Invalid Email Id");
		}
	}
	add(item: string) {
		this.createEventFormGroup.patchValue({eventLocation : item})
		this.locations = [];
	}

	removeFocus() {
		this.keyboard.close();
	}

	search() {
		if (!this.createEventFormGroup.controls.eventLocation.value.trim().length || !this.keyboard.isOpen()) {
			this.locations = [];
			return;
		}
		
		this.httpServiceProvider.getLocationList(this.createEventFormGroup.controls.eventLocation.value)
		.pipe(debounceTime(10),distinctUntilChanged()).subscribe((res)=>{
			if(res.status === "OK"){
				this.locations = [];
				res.predictions.forEach(element => {
					this.locations.push(element.description);
				});
			}else{
				this.locations = [];
			}
		})
	}
	formatDate(date) {
		let d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();
		
		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;
	
		return [year, month, day].join('-');
	}
	formatTime(date,haveToAddMinutes:boolean = false){
		let d = new Date(date),
		hours = ''+d.getHours();
		let minutes;

		if(haveToAddMinutes)
			minutes = ''+(d.getMinutes()+10);
		else
			minutes = ''+d.getMinutes();


		if(hours.length < 2) hours = '0' + hours;
		if(minutes.length < 2) minutes = '0' + minutes;

		return [hours,minutes].join(":");
	}
	eventStartDateChanged(){
		console.log(this.createEventFormGroup.controls.eventStartDate.value);
		this.minEventEndDate = this.formatDate(this.createEventFormGroup.controls.eventStartDate.value);
		this.createEventFormGroup.patchValue({eventEndDate : ''});
	}

	eventEndDateChanged(){
		let eventEndDate = this.createEventFormGroup.controls.eventEndDate.value;
		let eventStartDate = this.createEventFormGroup.controls.eventStartDate.value;
		console.log(eventEndDate);
		if(eventEndDate == eventStartDate){
			this.minEventEndTime = this.formatTime(eventEndDate+" "+this.createEventFormGroup.controls.eventStartTime.value,true);
			this.createEventFormGroup.patchValue({eventEndTime : ''})
		}
	}

	allDayEventValueChanged(){
		let checkBoxValue = this.createEventFormGroup.controls.eventForAllDay.value;
		console.log("All Day event value : ",checkBoxValue);
		if(checkBoxValue){
			this.createEventFormGroup.controls.eventEndTime.clearValidators();
			this.createEventFormGroup.controls.eventEndTime.updateValueAndValidity();
			this.createEventFormGroup.controls.eventStartTime.clearValidators();
			this.createEventFormGroup.controls.eventStartTime.updateValueAndValidity();
		}else{
			this.createEventFormGroup.controls.eventEndTime.setValidators(Validators.required);
			this.createEventFormGroup.controls.eventEndTime.updateValueAndValidity();
			this.createEventFormGroup.controls.eventStartTime.setValidators(Validators.required);
			this.createEventFormGroup.controls.eventStartTime.updateValueAndValidity();
		}
	}
}
