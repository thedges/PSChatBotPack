import { LightningElement, api } from 'lwc';
import noArticlesFound from '@salesforce/label/c.No_Articles';
import knowledgeArticleSubtitle from '@salesforce/label/c.Knowledge_Article_Card_Subtitle';

export function htmlDecode(input) {
    const element = document.createElement('div');
    // eslint-disable-next-line @lwc/lwc/no-inner-html
    element.innerHTML = input;

    // prettier-ignore
    return element.childNodes.length === 0
        ? ''
        : element.childNodes[0].nodeValue;
}

export default class PsChatBot_knowledgeArticleList extends LightningElement {

    label = {
        noArticlesFound,
        knowledgeArticleSubtitle,
    };

    @api inputParams;

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
            if (this.inputParams.length > 7)
            {
                jsonString = this.inputParams.substring(7);
                jsonString = htmlDecode(jsonString);
                console.log(jsonString);
                this.articles = JSON.parse(jsonString);
            }

            this.hasNoArticles = this.articles.length === 0;
        } catch (err) {
            console.error(err);
        }
    }
}