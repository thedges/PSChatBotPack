import { LightningElement, api, track } from 'lwc';
//import CLWCP_Assets from '@salesforce/resourceUrl/CLWCP_Assets';
import PSChatBotPack from '@salesforce/resourceUrl/PSChatBotPack_Images';

export default class PsChatBot_carousel extends LightningElement {
    @api inputParams;
    @track tiles = [];

    connectedCallback() 
    {
        var i;
        for (i = 0; i < this.inputParams.split(':')[2].split('|').length; i++) 
        {
            //console.log(PSChatBotPack);
            //var newTile = { title: this.inputParams.split(':')[2].split('|')[i].split(';')[0], desc: this.inputParams.split(':')[2].split('|')[i].split(';')[1], src: CLWCP_Assets.replace('CLWCP__', '') + '/' + this.inputParams.split(':')[2].split('|')[i].split(';')[2]};
            var newTile = { title: this.inputParams.split(':')[2].split('|')[i].split(';')[0], desc: this.inputParams.split(':')[2].split('|')[i].split(';')[1], src: PSChatBotPack_Images + '/' + this.inputParams.split(':')[2].split('|')[i].split(';')[2]};
            //alert(newTile.title);
            this.tiles.push(newTile);
        }
    }

    handleClick(event)
    {
        //alert(event.target.dataset.id);
        this.dispatchEvent(new CustomEvent('postmessage',{detail: 'lwc:hide:' + event.target.dataset.id}));
    }
}