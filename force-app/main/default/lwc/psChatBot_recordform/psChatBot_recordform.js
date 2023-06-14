import { LightningElement, api, track } from 'lwc';

export default class PsChatBot_recordform extends LightningElement {
    @api inputParams;
    @track objName = '';
    @track recordId = '';
    @track iconName = '';
    @track firstField = '';
    @track fields;
    @track labelName;
    
    renderedCallback()
    {
        var elems = this.template.querySelectorAll('lightning-output-field.slds-form-element__label');
        console.log('renderedCallback elems.length=' + elems.length);
        var index = 0, length = elems.length;
        for ( ; index < length; index++) {
          elems[index].style.fontWeight = "700";
        }
    }
    connectedCallback() 
    {
        console.log('inputParams = ' + this.inputParams);
        var params = this.inputParams.split(':');
        console.log('V3 param length = ' + params.length);
        
        this.objName = params[0];
        this.recordId = params[1];
        this.labelName = this.objName;
        if (this.objName.includes("__c"))
        {
            this.iconName = 'standard:default';
        }
        else
        {
            this.iconName = 'standard:' + this.objName.toLowerCase();
        }
        
        this.firstField = params[2].split(',')[0];
        console.log('firstField = ' + this.firstField);
        
        if (params[2].split(',').length > 1)
        {
            this.fields = params[2].split(',').map(item => item.trim());
            this.fields.shift();
        }  
  console.log('fields = ' + JSON.stringify(this.fields));

        if (params.length >= 4)
        {
           this.labelName = params[3];
           console.log('labelName = ' + this.labelName);
        }
        if (params.length >= 5)
        {
            this.iconName = params[4].replace(".", ":");
            console.log('iconName = ' + this.iconName);
        }
        var elems = this.template.querySelectorAll('.slds-form-element__label');
        console.log('connectedCallback elems.length=' + elems.length);
        var index = 0, length = elems.length;
        for ( ; index < length; index++) {
          elems[index].style.fontWeight = "700";
        }
        //this.template.querySelector('span').style.fontWeight = "700";
        /*
        this.objName = this.inputParams.split(':')[2];
        this.recordId = this.inputParams.split(':')[3];
        if (this.objName.includes("__c"))
        {
            this.iconName = 'standard:default';
        }
        else
        {
            this.iconName = 'standard:' + this.objName.toLowerCase();
        }
        
        this.firstField = this.inputParams.split(':')[4].split(',')[0];
        
        if (this.inputParams.split(':')[4].split(',').length > 1)
        {
            this.fields = this.inputParams.split(':')[4].split(',');
            this.fields.shift();
        }  
        */
    }
}