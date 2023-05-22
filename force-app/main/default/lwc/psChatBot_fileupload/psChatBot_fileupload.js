import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import setFile from '@salesforce/apex/PSChatBotPack_SetFileApex.setFileApex';


export default class PsChatBot_fileupload extends LightningElement {
    @api inputParams;
    @api myRecordId;
    fileName = null;
    bField = null;
    commAccess = null;

    connectedCallback() 
    {
        var params = this.inputParams.split(':');        
        this.myRecordId = params[0];
        //alert(this.myRecordId);

        if (params.length >= 2)
        {
           this.fileName = params[1];
           console.log('fileName = ' + this.fileName);
        }

        if (params.length >= 3)
        {
           this.bField = params[2];
           console.log('bField = ' + this.bField);
        }

        if (params.length >= 4)
        {
           this.commAccess = params[3];
           console.log('commAccess = ' + this.commAccess);
        }
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        var self = this;
        const uploadedFiles = event.detail.files;

        if (uploadedFiles.length > 0)
        {
            var documentId = uploadedFiles[0].documentId;
            setFile({recordId: this.myRecordId, fileId: documentId, fileName: this.fileName, bField: this.bField, commAccess: this.commAccess})
        .then(result => {
        })
        .catch (error => {
           self.handleError(error);
        });

            this.dispatchEvent(new CustomEvent('postmessage',{
                detail: 'lwc:hide:' + this.myRecordId
            }));
        }
        else
        {
            alert("No files uploaded");
        }
    }

    handleError (err) {
        console.log ('error=' + err);
        console.log ('type=' + typeof err);
    
        const event = new ShowToastEvent ({
          title: err.statusText,
          message: err.body.message,
          variant: 'error',
          mode: 'pester',
        });
        this.dispatchEvent (event);
      }
}