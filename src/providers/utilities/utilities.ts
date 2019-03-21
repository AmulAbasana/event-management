import { Injectable } from '@angular/core';
import { AlertController, Alert } from 'ionic-angular';

@Injectable()
export class UtilitiesProvider {

	private alert: Alert;
	constructor(private alertCtrl : AlertController) {
		console.log('Hello UtilitiesProvider Provider');
	}

	showAlert(title, message, buttons?) {
        if (this.alert != null) {
            this.alert.dismiss().catch(() => console.log('ERROR CATCH: AlertController dismiss'));
            this.alert = null
        }
        this.alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: (typeof buttons != 'undefined' && buttons != null) ? buttons : ['Ok']
        });
        this.alert.present();
    }

}
