import { LightningElement, api } from 'lwc';

export default class PsChatBot_hyperlink extends LightningElement {
    @api inputParams;
    label = null;
    url = null;
    target = null;

    connectedCallback() 
    {
        this.inputParams = this.inputParams.substring(14);
        var input = this.inputParams.split("|");
        console.log(input);

        if (input.size() >= 1) this.label = input[0];
        if (input.size() >= 2) this.url = input[1];
        if (input.size() >= 3) this.target = input[2];
    }

    /*
    handleClick(event)
    {
        //alert(event.target.dataset.id);
        this.dispatchEvent(new CustomEvent('postmessage',{detail: 'lwc:hide:' + event.target.dataset.id}));
    }
    */

}