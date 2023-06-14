import { api, LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class PsChatBot_geomap extends LightningElement {
    @api inputParams;
    showMap = true;
    height = 300;
    zoomLevel=13;
    startLatitude = 37.77507;
    startLongitude = -122.42314;
    enableCenterOnLocation = false;
    enableReverseGeocode = true;
    enableAddressAutocomplete = false;

    connectedCallback() {
        console.log('inputParams=' + this.inputParams);
        var items = null;

        try {
            items = this.inputParams.split(':');

            if (items.length === 6) {
                this.height = items[0];
                this.zoomLevel = items[1];
                this.startLatitude = items[2];
                this.startLongitude = items[3];
                this.enableCenterOnLocation = (items[4] === 'true');
                this.enableAddressAutocomplete = (items[5] === 'true');
            }
            else {
                this.alertMisconfiguration();
            }
        }
        catch (err) {
          this.alertException(err);
        }
    }

    /*
    configOptions()
    {
        var str = '';

        if (this.enableCenterOnLocation)
        {
            str = 'enable-center-on-location';
        }

        if (this.enableAddressAutocomplete)
        {
            str = str + (str.length > 0 ? ' ' : '');
            str = str + 'enable-address-autocomplete';
        }

        console.log('configOptions = ' + str);

        return str;
    }
    */

    alertException(err) {
        const evt = new ShowToastEvent({
            title: 'PSChatBotPack: Geomap component error [' + err.name + ']',
            message: err.message,
            variant: 'error',
            mode: 'sticky'
        });
        this.dispatchEvent(evt);
    }

    alertMisconfiguration() {
        const evt = new ShowToastEvent({
            title: 'PSChatBotPack: Geomap component is misconfigured',
            message: 'format: lwc:geomap:<height>:<zoom-level>:<start-lat>:<start-lng>:<center-on-location>:<address-autocomplete>',
            variant: 'error',
            mode: 'sticky'
        });
        this.dispatchEvent(evt);
    }

    setCrosshair(event) {
        console.log('setCrosshair() invoked...');
        console.log(JSON.stringify(event.detail));
        this.dispatchEvent(new CustomEvent('postmessage', { detail: 'lwc:hide:' + JSON.stringify(event.detail) }));
        this.showMap = false;
    }
}