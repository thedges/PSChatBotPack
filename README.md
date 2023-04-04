# PSChatBotPack
This repo provides various demo LWCs and Apex actions for Salesforce chatbot demos. Since a chatbot can only be configured for one "uber" LWC to interpret chat markup and display various LWCs, this repo is an aggregation of custom LWCs and other 3rd party github repos.

# 3rd Party Sites Utilized for this Repo
* [Chat-Lightning-Web-Component-Pack](https://github.com/Colatabajonies/Chat-Lightning-Web-Component-Pack) - this is a repo created by Chris Gilmore for various LWCs to be used in chatbots. I've repackaged and even altered his originals in some cases. Details provided in [this Quip doc](https://salesforce.quip.com/WM7AA3tXRsaf).


# Installation
1. Ensure that you have an existing Embedded Service Deployment configured for Salesforce Chat.
2. Install this repo to your target demo org.
3. Customize the Embedded Service Deployment
    1. Navigate to Setup → Feature Settings → Service → Embedded Service → Embedded Service Deployments. Click View on the relevant Deployment.
    2. In Chat Settings, Click Edit.
    3. Under the section “Customize with Lightning Components”, click Edit.
    4. Change the “Chat Messages (Text)” dropdown to lwcchatpack, and click Save.
4. Create a Static Resource named CLWCP_Assets for all carousel images (Optional)
    1. Navigate to Setup → Custom Code → Static Resources. Click New.
    2. Name: CLWCP_Assets
    3. Upload your zip file
    4. Select either private or public depending on your use case.
    5. Click Save.

5. Update Community pages in Community Builder
    1. Navigate to Setup → Feature Settings → Communities → All Communities. Click Builder on the relevant Community.
    2. Add js snippet to header
        a. Click the Gear on the left hand panel (Settings). Choose Advanced, and then click Edit Head Markup.
        b. Paste the code below in the head code
        c. Click Save
         
```
<style>
    ul.slds-carousel__indicators{
  display:flex;
  margin:0.5rem 0px;
}
li.slds-carousel__indicator{
  display:flex;
  margin:0px 0.25rem;
}
</style>
<script>
window.addEventListener("message", receiveMessage, false);
function receiveMessage(event) {
    var payload = event.data;

    if(payload && payload.type === "chasitor.sendMessage") {
        embedded_svc.postMessage("chasitor.sendMessage", payload.message);
    }
};
</script>
```

6. Apply the ChatStyle Static Resource to your embedded Chat in your Salesforce Community (or hosting site).
    1. Navigate to the home page of the community (or wherever the chat will take place).
    2. Add/Edit the Embedded Service Chat Component on the community home page, and set to the relevant embedded service deployment .
       a. Under the “External Styles” Section, put CLWCP__ChatStyle
    3. Add a new standard community page (for utilizing the flow LWC)
        a. Click the page dropdown, and click + New Page.
        b. Select Standard Page, and choose Full width or Flexible Layout.
        c. Give the page a name and URL of “flowcomponent”. Click Create.
        d. Remove all headers/components/chat from the new page.
        e. Add the Chat LWC Pack - Run Flow component to the page full width. Ensure input “FlowName” is set to {!flowName}
    4. Publish the community.


7. Give your bot user permission to relevant objects and classes (Optional). If using the demo bot packaged with the package, the following permissions will need to be added to the permission set: sfdc.chatbot.service.permset
    1. Object Permissions
        1. Case: READ (fields: Subject, Status, Priority)
        2. Chat Transcript: READ (fields: Contact Name)
    2. Apex Classes
        1. CLWCP.ApplyRegExToString
        2. CLWCP.GetFlowOutputValue
8. Connect your bot to the relevant embedded service deployment.
9. Activate the bot.


# Usage

Each lightning component as part of this pack can be activated by agent/bot message text that starts with a reserved “Prefix Syntax”, which identifies the component, and it’s parameters. Below, each component is outlined, and it's syntax. 

Note that if curly brackets are shown in the syntax below, that is to indicate a variable can be inserted; however, if you are hardcoding values please omit said brackets as that will cause the component to not work correctly. 


## DatePicker

Chat Prefix Syntax: lwc:datepicker

Provide a selectable calendar control to the customer in a chat. When the user then clicks on a date, the date response will be sent back. If using with an Einstein Bot, use a question block with return type “System.Date”, as shown below:

## Record Tile

Chat Prefix Syntax: lwc:recordtile:{objectName}:{recordId}:{field1,field2,field3,....}

Present a formatted “Compact View” of an object record in chat.

Parameters

* objectName: The API name of the standard or custom object that will be displayed.
* recordId: The Id of the record that will be displayed.
* fields: A comma separated list of the field API names that will be displayed. The first field in the list will serve as the tile title.



## HTML

Chat Prefix Syntax: lwc:html:{htmlText}

Present unescaped HTML markup in the chat.

Parameters

* htmlText: The HTML to be displayed.



## Google Map

Chat Prefix Syntax: lwc:gmap:{mapAPIkey}:{searchTerm}:{mapWidth}:{mapHeight}

Provide an embedded google map of a defined point of interest to the customer in a chat.

Parameters

* mapAPIkey: Your Google map API key to use the Google Map Embed API.
* searchTerm: The address or point of interest to show on the map.
* mapWidth: The width of the map component (Optional).
* mapHeight: The height of the map component (Optional).



## File Upload

Chat Prefix Syntax: lwc:fileupload:{relatedRecordId}

Allow the customer to upload a file in the chat window, and have it attached to a designated record. Once the file is uploaded, a hidden response is provided automatically by the customer in the syntax: lwc:hide:{relatedRecordId} where relatedRecordId is again confirming the recordId that the file was attached to. Therefore, it is best to use the file upload component in a Question block if using a chatbot, to save the response to a slot. Also, see “lwc:hide” for more information about hiding text.

Parameters

* mapAPIkey: Your Google map API key to use the Google Map Embed API.
* searchTerm: The address or point of interest to show on the map.
* mapWidth: The width of the map component (Optional).
* mapHeight: The height of the map component (Optional).



## Flow

Chat Prefix Syntax: lwc:flow:{flowURL}:{height}

Allow the customer to step through a screen flow. Once the flow is finished, a hidden response is provided automatically by the customer in the syntax: lwc:hide:{flowOutputParams} where flowOutputParams is JSON containing any output provided by the flow. Therefore, it is best to use the flow component in a Question block if using a chatbot, to save the output to a slot. Also, see “lwc:hide” for more information about hiding text. Ensure that you followed the community page steps above to have your flowcomponent page setup prior to using the flow component.

Parameters

* flowURL: the API name of your flow, with URL params to set input (ie “myFlowName&param1=val1&param2=val2)
* height: the height in pixels that you want the iFrame to be



## Navigate

Chat Prefix Syntax: lwc:navigate:{type}:{sessionId}:{path}

Allow the bot/agent to automatically redirect the customer’s browser page to a record, knowledge article, or community page.

Parameters

* type: valid values are article, record, or page.
* sessionId: the chat transcript ID. This will prevent endless loops of navigating upon page reloads. A specific page, record, or article will only be navigated to once per chat session.
* path: The URL, recordID, or knowledge article URLName.
    * article: When type==article, path will be equal to the knowledge article URLName.
    * record: When type==record, path will be equal to the recordID.
    * page: When type==page, path will be equal to the page relative URL.



## Carousel

Chat Prefix Syntax: lwc:carousel:{tile1Title;tile1Description;tile1ImagePath|tile2Title;tile2Description;tile2ImagePath|...}

Display a revolving carousel of content tiles in the chat window, and allow the customer to select one. When the customer clicks on a tile, a hidden response is provided automatically by the customer in the syntax: lwc:hide:{tileTitle} where tileTile denotes the title of the tile that was selected. Therefore, it is best to use the carousel component in a Question block if using a chatbot, to save the selected tile response to a slot. Also, see “lwc:hide” for more information about hiding text.

Images displayed in the carousel MUST be pre-loaded in a static resource named “CLWCP_Assets”. This must be created ahead of time. See installation instructions.

Parameters
Carousel tiles are provided as input parameters in a bar seperated “|” list of items. Each property in a given tile is semi-colon “;” seperated. Carousel is limited to a max of 5 tiles. Each tile contains the following properties

* tileTitle: The header text for the tile
* tileDescription: Description text for the tile
* tileImagePath: The path to the image inside of the CLWCP_Assets static resource.




## Survey

Chat Prefix Syntax: lwc:survey:{type}:{additionalparams}

Display a survey question of a certain type, outlined below. When the user clicks on a star, number, or checkbox list, a hidden response is provided automatically by the customer in the syntax: lwc:hide:{value} where value denotes the number of stars, nps, or a separated list of selected values. Therefore, it is best to use the carousel component in a Question block if using a chatbot, to save the selected tile response to a slot. Also, see “lwc:hide” for more information about hiding text.

Parameters

* type: the type of question. Valid values are: star, nps, or checkbox
* additionalparams: the additional params specific to the type
    * When type = star - negative text : positive text.
        * Example: lwc:survey:star:Hate it: Love it!
    * When type = nps, no additional params
        * Example: lwc:survey:nps
    * When type = checkbox, semi-colon list of values
        * Example: lwc:survey:checkbox:Sales Cloud;Service Cloud;Marketing Cloud; IoT;Quip;Heroku;Tableau




# Hide

If you’d like to hide either agent or customer text in a chat window, you can prefix any chat message with lwc:hide: to not display this message in the chat window. This is mostly used when developing additional lightning components that post back responses to the chat when the customer clicks/selects something in the custom UI. For example, they are used in the response message in the File Upload and Carousel component.




# Troubleshooting

## Carousel Images

If your carousel component is just displaying the image titles and descriptions, but not the image, confirm that your static resource package just contains the images, not a folder. i.e. when packaging your images, select all the images you’d like to upload, right click, and click “Compress" - do not compress the folder the images are contained in. 

## File Upload Error

When hardcoding a Salesforce record ID into the File Upload component do not include curly brackets {}, e.g. “lwc:fileupload:0033h000008a0KPAAY“. Failure to do this will prompt users to select a record type and present an error message after the initial upload screen. 

## Note

While this package can be installed in any org and used as is, it was intended as a foundation for customization. Due to the nature of the components, we’re unable to host the unmanaged package on the AppExchange. If you’d like to customize any of the components, you' will need to install using this Github package instead. 






