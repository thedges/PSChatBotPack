import { LightningElement, api } from 'lwc';
import seeMoreArticles from '@salesforce/label/c.See_More_Articles';
import lastUpdated from '@salesforce/label/c.Last_Updated';

const COMMAND_OPEN_KNOWLEDGE_ARTICLE = 'open-knowledge-article';
const EVENT_NAMESPACE = 'workdotcom';

export default class PsChatBot_knowledgeArticleCard extends LightningElement {
    label = {
        seeMoreArticles,
        lastUpdated,
    };

    @api lastUpdated;
    @api title;
    @api subtitle;
    @api summary;
    @api link;
    @api image;
    @api recordId;
    @api urlName;
    @api articlefromlist;
    @api showFooter = false;

    articleStyle;
    articleHeaderStyle;
    titleOrLink;
    val;

    connectedCallback() {
        this.articleHeaderStyle =
            this.articlefromlist === 'true'
                ? 'card-body slds-border_top slds-border_left slds-border_right'
                : 'card-body slds-border_top slds-border_left slds-border_right top-round-borders';

        this.articleStyle =
            this.articlefromlist === 'true'
                ? 'title multi-line-truncate slds-text-heading_x-small slds-p-left_x-small'
                : 'title multi-line-truncate slds-text-heading_small slds-p-left_x-small';

        if (this.showFooter === 'true') {
            this.articleHeaderStyle += ' footer';
        }

        this.titleOrLink = this.title || this.link;
        this.val = {
            title: this.titleOrLink,
            subtitle: this.subtitle,
            lastUpdated: this.lastUpdated,
            summary: this.summary,
            href: this.link,
            image: this.image,
        };
    }

    openKnowledgeArticle = (event) => {
        event.preventDefault();

        const targetOrigin = window.location.origin;

        window.postMessage(
            {
                namespace: EVENT_NAMESPACE,
                command: COMMAND_OPEN_KNOWLEDGE_ARTICLE,
                detail: {
                    urlName: this.urlName,
                },
            },
            targetOrigin
        );
    };

    openSearchResults = () => {
        // Temporary Implementation until DW Integration
        const win = window.open(this.val.href, '_blank');
        win.focus();
    };
}