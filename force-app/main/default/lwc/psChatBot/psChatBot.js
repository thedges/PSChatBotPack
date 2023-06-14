import BaseChatMessage from 'lightningsnapin/baseChatMessage';
import { LightningElement, track } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';

const CHAT_CONTENT_CLASS = 'chat-content';
const AGENT_USER_TYPE = 'agent';
const CHASITOR_USER_TYPE = 'chasitor';
const SUPPORTED_USER_TYPES = [AGENT_USER_TYPE, CHASITOR_USER_TYPE];

const LWC_PREFIX = 'lwc:';
const LWC_GMAP = 'lwc:gmap';
const LWC_DATEPICKER = 'lwc:datepicker';
const LWC_HTML = 'lwc:html';
const LWC_FILEUPLOAD = 'lwc:fileupload';
const LWC_RECORDTILE = 'lwc:recordtile';
const LWC_CAROUSEL = 'lwc:carousel';
const LWC_FLOW = 'lwc:flow';
const LWC_NAVIGATE = 'lwc:navigate';
const LWC_SURVEY = 'lwc:survey';
const LWC_YOUTUBE = 'lwc:youtube';
const LWC_KA = 'lwc:ka';
const LWC_GEOMAP = 'lwc:geomap';
const LWC_HIDE = 'lwc:hide';


export default class PsChatBot extends BaseChatMessage {
    @track strMessage = '';

    //Add a var to track visibility for the component
    @track isBaseTextVisible = false;
    @track gmap = false;
    @track datepicker = false;
    @track html = false;
    @track fileupload = false;
    @track recordtile = false;
    @track carousel = false;
    @track flow = false;
    @track navigate = false;
    @track survey = false;
    @track youtube = false;
    @track knowledge = false;
    @track geomap = false;

    connectedCallback() {
        //Set message string
        this.strMessage = this.messageContent.value;
        console.log('original msg = ' + this.strMessage);

        if (this.isSupportedUserType(this.userType)) {
            //if using a lwc, remove any emojis that may have been inserted by the bot (ie :D or :p )
            if (this.userType == 'agent' && this.messageContent.value.startsWith(LWC_PREFIX)) {
                this.strMessage = this.strMessage.replace(/😀/g, ':D').replace(/😛/g, ':p');
            }

            if (this.userType == 'agent' && this.messageContent.value.startsWith(LWC_GMAP)) {
                this.strMessage = this.trimMsgPrefix(this.messageContent.value, LWC_GMAP);
                this.gmap = true;
            }
            else if (this.userType == 'agent' && this.messageContent.value.startsWith(LWC_DATEPICKER)) {
                this.strMessage = this.trimMsgPrefix(this.messageContent.value, LWC_DATEPICKER);
                this.datepicker = true;
            }
            else if (this.userType == 'agent' && this.messageContent.value.startsWith(LWC_HTML)) {
                this.strMessage = this.trimMsgPrefix(this.messageContent.value, LWC_HTML);
                this.html = true;
            }
            else if (this.userType == 'agent' && this.messageContent.value.startsWith(LWC_FILEUPLOAD)) {
                this.strMessage = this.trimMsgPrefix(this.messageContent.value, LWC_FILEUPLOAD);
                this.fileupload = true;
            }
            else if (this.userType == 'agent' && this.messageContent.value.startsWith(LWC_RECORDTILE)) {
                this.strMessage = this.trimMsgPrefix(this.messageContent.value, LWC_RECORDTILE);
                this.recordtile = true;
            }
            else if (this.userType == 'agent' && this.messageContent.value.startsWith(LWC_CAROUSEL)) {
                this.strMessage = this.trimMsgPrefix(this.messageContent.value, LWC_CAROUSEL);
                this.carousel = true;
            }
            else if (this.userType == 'agent' && this.messageContent.value.startsWith(LWC_FLOW)) {
                this.strMessage = this.trimMsgPrefix(this.messageContent.value, LWC_FLOW);
                this.flow = true;
            }
            else if (this.userType == 'agent' && this.messageContent.value.startsWith(LWC_NAVIGATE)) {
                this.strMessage = this.trimMsgPrefix(this.messageContent.value, LWC_NAVIGATE);
                this.navigate = true;
            }
            else if (this.userType == 'agent' && this.messageContent.value.startsWith(LWC_SURVEY)) {
                this.strMessage = this.trimMsgPrefix(this.messageContent.value, LWC_SURVEY);
                this.survey = true;
            }
            else if (this.userType == 'agent' && this.messageContent.value.startsWith(LWC_YOUTUBE)) {
                this.strMessage = this.trimMsgPrefix(this.messageContent.value, LWC_YOUTUBE);
                this.youtube = true;
            }
            else if (this.userType == 'agent' && this.messageContent.value.startsWith(LWC_KA)) {
                this.strMessage = this.trimMsgPrefix(this.messageContent.value, LWC_KA);
                this.knowledge = true;
            }
            else if (this.userType == 'agent' && this.messageContent.value.startsWith(LWC_GEOMAP)) {
                this.strMessage = this.trimMsgPrefix(this.messageContent.value, LWC_GEOMAP);
                this.geomap = true;
            }

            //Add an elseif to show ur component....


            //ELSE SHOW BASE CHAT MESSAGE

            else if (!this.messageContent.value.startsWith(LWC_HIDE)) {
                this.isBaseTextVisible = true;
                this.messageStyle = `${CHAT_CONTENT_CLASS} ${this.userType}`;
            }

        }
        else {
            throw new Error('Unsupported user type passed in: ${this.userType}');
        }
    }

    trimMsgPrefix(msg, prefix) {
        if (msg != null && prefix != null && msg.length > prefix.length) {
            return msg.substring(prefix.length + 1);
        }

        return msg;
    }


    isSupportedUserType(userType) {
        return SUPPORTED_USER_TYPES.some((supportedUserType) => supportedUserType === userType);
    }

    extractOriginalUrl(generatedString) {
        const matched = generatedString.match(/<a href.+>(.*?)<\/a>/);
        if (matched.length > 1) {
            return matched[1];
        }
        return generatedString;
    }

    handlePostMessage(event) {
        console.log('handlePostMessage invoked...');
        const dateValue = event.detail;
        console.log('Handling Event with value: ' + dateValue);
        window.postMessage(
            {
                message: dateValue,
                type: "chasitor.sendMessage"
            },
            window.parent.location.href
        );
    }
}