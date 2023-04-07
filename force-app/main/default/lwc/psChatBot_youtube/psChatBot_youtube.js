import { LightningElement, api } from 'lwc';

export default class PsChatBot_youtube extends LightningElement {
    @api inputParams;
    content = null;

    connectedCallback()
    {
        var contentValue = this.inputParams.split(':')[2];
        this.content = 'https://www.youtube.com/embed/' + contentValue;
    }
    
}