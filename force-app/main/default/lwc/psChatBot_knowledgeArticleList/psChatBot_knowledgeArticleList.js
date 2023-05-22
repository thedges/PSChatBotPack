import { LightningElement, api } from 'lwc';
import noArticlesFound from '@salesforce/label/c.No_Articles';
import knowledgeArticleSubtitle from '@salesforce/label/c.Knowledge_Article_Card_Subtitle';
import buffer from 'c/psChatBot_buffer';

export function htmlDecode(input) {
    // trying this approach from some Google searching
    let txt = document.createElement("textarea");
    txt.innerHTML = input;
    return txt.value;
    
     // this is original code from Chris Gilmore library
    /*
    const element = document.createElement('div');
    // eslint-disable-next-line @lwc/lwc/no-inner-html
    element.innerHTML = input;

    // prettier-ignore
    return element.childNodes.length === 0
        ? ''
        : element.childNodes[0].nodeValue;
        //: (element.childNodes[0].textContext || element.childNodes[0].innerText);
        */
    
}

export default class PsChatBot_knowledgeArticleList extends LightningElement {

    label = {
        noArticlesFound,
        knowledgeArticleSubtitle,
    };

    @api inputParams;
    priority = "ANSWER";
    truncate = false;
    rate = false;
    collapse = true;

    /**
     * listOfArticles = [id, title, date, summary, link, image]
     */
    //listOfArticles = [];
    articles = [];
    hasNoArticles;

    connectedCallback() {
        var jsonString = null;

        try {

            console.log(this.inputParams);
            var params = this.inputParams.split(':');    
            
            console.log(JSON.stringify(params));

            if (params.length >= 1)
            {
                const Buffer = buffer.Buffer;

                jsonString = params[0];
                jsonString = Buffer.from(jsonString, 'base64');
                console.log('base64decoded = ' + jsonString);
                this.articles = JSON.parse(jsonString);
                console.log(this.articles);
            }

            if (params.length >= 2)
            {
                this.priority = params[1];
            }

            if (params.length >= 3)
            {
                this.truncate = (params[2] === 'true');
            }

            if (params.length >= 4)
            {
                this.collapse = (params[3] === 'true');
            }

            if (params.length >= 5)
            {
                this.rate = (params[4] === 'true');
            }

            console.log('priority = ' + this.priority);
            console.log('truncate = ' + this.truncate);
            console.log('collapse = ' + this.collapse);
            console.log('rate = ' + this.rate);

            this.hasNoArticles = this.articles.length === 0;
        } catch (err) {
            console.error(err);
        }
    }

    handlePostMessage(event) 
    {
        console.log('forwarding up event...');
        this.dispatchEvent(event);
    }
}