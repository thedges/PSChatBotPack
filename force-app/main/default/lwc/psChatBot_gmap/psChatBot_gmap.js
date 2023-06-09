import { LightningElement, api, track } from 'lwc';

export default class PsChatBot_gmap extends LightningElement {
    @api inputParams;
    @track showMap = false;
    @track disableButton = false;
    @track mapURL = '';
    @track mapWidth = '260';
    @track mapHeight = '250';

    connectedCallback() 
    {
        if (this.inputParams.split(':').length === 4)
        {
            this.mapWidth = this.inputParams.split(':')[2];
            this.mapHeight = this.inputParams.split(':')[3];
        }
        else if (this.inputParams.split(':').length > 1)
        {
            this.showMap = true;
            this.mapURL = 'https://www.google.com/maps/embed/v1/place?key=' + this.inputParams.split(':')[0] + '&q=' + this.inputParams.split(':')[1];
        }
    }

    sendLocation(event)
    {
        if (navigator.geolocation) 
        {
            this.disableButton = true;
            navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
          } else {
            alert('Geolocation is not supported by this browser.');
          }
    }

    showPosition(position) 
    {
        //alert('lat:' + position.coords.latitude + ' lon:' + position.coords.longitude);
        this.dispatchEvent(new CustomEvent('postmessage',{
            detail: 'lwc:hide:' + position.coords.latitude + ',' + position.coords.longitude
        }));
      }
}