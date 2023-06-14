import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import communityId from '@salesforce/community/Id';
import communityPath from '@salesforce/community/basePath';
import seeMoreArticles from '@salesforce/label/c.See_More_Articles';
import lastUpdated from '@salesforce/label/c.Last_Updated';
import IMAGES from '@salesforce/resourceUrl/PSChatBotPack_Images';
import voteArticle from '@salesforce/apex/PSChatBotPack_ArticleVote.voteArticle';

const COMMAND_OPEN_KNOWLEDGE_ARTICLE = 'open-knowledge-article';
const EVENT_NAMESPACE = 'pschatbotpack';

export default class PsChatBot_knowledgeArticleCard extends LightningElement {
    label = {
        seeMoreArticles,
        lastUpdated,
    };

    @api id;
    @api articleNum;
    @api lastUpdated;
    @api title;
    @api subtitle;
    @api summary;
    @api answer;
    @api chatAnswer;
    @api link;
    @api image;
    @api recordId;
    @api urlName;
    @api updateFlag = false;
    @api articlefromlist;
    @api showFooter = false;
    @api priority = "ANSWER";
    @api truncate = false;
    @api rate = false;
    @api collapse = false;

    content = null;


    articleStyle = '';
    articleHeaderStyle = '';
    answerStyle = '';
    titleOrLink;
    val;

    thumbsUpURL = IMAGES + '/thumbs-up.png';
    thumbsDownURL = IMAGES + '/thumbs-down.png';

    connectedCallback() {
        console.log('INSIDE CARD');
        
        this.articleHeaderStyle =
            this.articlefromlist === 'true'
                ? 'card-body slds-border_top slds-border_left slds-border_right'
                : 'card-body slds-border_top slds-border_left slds-border_right top-round-borders';

        this.articleStyle =
            this.articlefromlist === 'true'
                ? 'title multi-line-truncate slds-text-heading_x-small'
                : 'title multi-line-truncate slds-text-heading_small';

        // 'slds-line-clamp_large summary slds-p-left_x-small'     
        this.answerStyle = 'ka-summary';

        if (this.truncate) this.answerStyle = this.answerStyle + ' slds-line-clamp_large';

        if (this.showFooter === 'true') {
            this.articleHeaderStyle += ' footer';
        }

        this.content = this.summary;
        if (this.priority === "ANSWER") {
            if (this.answer != null && this.answer.length > 0) {
                this.content = this.answer;
            }
            else if (this.chatAnswer != null && this.chatAnswer.length > 0) {
                this.content = this.chatAnswer;
            }
        }
        else if (this.priority === "CHAT") {
            if (this.chatAnswer != null && this.chatAnswer.length > 0) {
                this.content = this.chatAnswer;
            }
            else if (this.answer != null && this.answer.length > 0) {
                this.content = this.answer;
            }

        }

        if (this.content == null)
        {
            this.content = 'This knowledge article needs to be updated with Chat Answer or Answer.';
            this.updateFlag = true;
            this.rate = false;
        }
        else{
          this.content = this.content.replace(/b>/g, 'strong>');
        }


        if (this.updateFlag) this.answerStyle = this.answerStyle + ' update-needed';

        console.log('  > priority = ' + this.priority);
        console.log('  > truncate = ' + this.truncate);
        console.log('  > collapse = ' + this.collapse);
        console.log('  > rate = ' + this.rate);
        console.log('  > content = ' + this.content);

        this.titleOrLink = this.title || this.link;
        this.val = {
            id: this.id,
            title: this.titleOrLink,
            subtitle: this.subtitle,
            lastUpdated: this.lastUpdated,
            content: this.content,
            href: this.link,
            image: this.image,
            update: this.updateFlag
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
                    communityId: communityId,
                    communityPath: communityPath
                },
            },
            targetOrigin
        );
    };

    handleExpand = (event) => {
        this.collapse = false;
    }

    handleCollapse = (event) => {
        this.collapse = true;
    }

    handleAttach = (event) => {
        console.log('handleAttach invoked');
        this.dispatchEvent(new CustomEvent('postmessage', {
            detail: 'lwc:hide:' + this.id + ',' + this.title, bubbles: true, composed: true
        }));
    }

    handleLike = (event) => {
        var self = this;

        console.log('handleLike invoked');


        /*
        var msg = {};
        msg.id = this.id;
        msg.title = this.title;
        msg.action = 'LIKE';

        console.log(JSON.stringify(msg));
        this.dispatchEvent(new CustomEvent('postmessage', {
            detail: 'lwc:hide:' + JSON.stringify(msg), bubbles: true, composed: true
        }));
        */

        voteArticle({articleNum: this.articleNum, voteUpDown: 'Up'})
        .then(result => {
            this.rate = false;
        })
        .catch (error => {
           self.handleError(error);
        });
    }

    handleUnlike = (event) => {
        var self = this;

        console.log('handlUnlike invoked');


        /*
        var msg = {};
        msg.id = this.id;
        msg.title = this.title;
        msg.action = 'UNLIKE';

        console.log(JSON.stringify(msg));
        this.dispatchEvent(new CustomEvent('postmessage', {
            detail: 'lwc:hide:' + JSON.stringify(msg), bubbles: true, composed: true
        }));
        */

        voteArticle({articleNum: this.articleNum, voteUpDown: 'Down'})
        .then(result => {
            this.rate = false;
        })
        .catch (error => {
           self.handleError(error);
        });
    }

    openSearchResults = () => {
        // Temporary Implementation until DW Integration
        const win = window.open(this.val.href, '_blank');
        win.focus();
    };

    handleError (err) {
        console.log ('error=' + err);
        console.log ('message=' + err.message);
        console.log ('type=' + typeof err);
        console.log (JSON.stringify(err));
    
        const event = new ShowToastEvent ({
          title: err.statusText,
          message: err.body.message,
          variant: 'error',
          mode: 'pester',
        });
        this.dispatchEvent (event);
      }
}