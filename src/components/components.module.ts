import { NgModule } from '@angular/core';
import { EventDetailComponent } from './event-detail/event-detail';
import { IonicModule } from 'ionic-angular';
@NgModule({
	declarations: [EventDetailComponent],
	imports: [IonicModule],
	exports: [EventDetailComponent]
})
export class ComponentsModule {}
