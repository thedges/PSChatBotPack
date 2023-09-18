global with sharing class PSChatBotPack_SearchKnowledgeArticles
{
    private static Integer MAX_LENGTH = 500;
    private static Integer MAX_COUNT = 10;

    // Custom Setting: PSChatBotPackKA
    //  Object_API_Name__c - Knowledge__kav
    //  Image_Field_API_Name__c - Image__c
    //  Answer_Field_API_Name__c - Answer__c
    //  Chat_Answer_Field_API_Name__c - Chat_Answer__c

    global static void test()
    {
        List<SearchRequest> srList = new List<SearchRequest>();
        SearchRequest req = new SearchRequest();
        req.searchString = 'insurance';
        req.maxCount = 5;
        srList.add(req);

        List<String> strList = PSChatBotPack_SearchKnowledgeArticles.searchArticles(srList);
        System.debug(JSON.serialize(EncodingUtil.base64Decode(strList[0])));
    }

    @InvocableMethod(label = 'Search Knowledge Articles (PSChatBotPack)')
    global static List<String> searchArticles(List<SearchRequest> requests)
    {
        ///////////////////////////////
        // get custom setting values //
        ///////////////////////////////
        PSChatBotPackKA__mdt param = PSChatBotPackKA__mdt.getInstance('PSChatBotPackKA');
        String objectAPIName = param.Object_API_Name__c;
        String imageFieldAPIName = param.Image_Field_API_Name__c;
        String answerFieldAPIName = param.Answer_Field_API_Name__c;
        String chatAnswerFieldAPIName = param.Chat_Answer_Field_API_Name__c;

        Integer i;
        String retVal = null;
        List<ArticleDetails> adList = new List<ArticleDetails>();

        try
        {
            if (requests.size() > 0)
            {

                //////////////////////////////
                // build SOSL search string //
                //////////////////////////////
                String searchStr = 'FIND \'' + requests[0].searchString + '\' IN ALL FIELDS RETURNING ' + objectAPIName + '(Id, ArticleNumber, Title, Summary, UrlName, LastModifiedDate';
                if (imageFieldAPIName != null)
                {
                    searchStr += ', ' + imageFieldAPIName;
                }

                if (answerFieldAPIName != null)
                {
                    searchStr += ', ' + answerFieldAPIName;
                }

                if (chatAnswerFieldAPIName != null)
                {
                    searchStr += ', ' + chatAnswerFieldAPIName;
                }

                searchStr += ') LIMIT ' + requests[0].maxCount;

                System.debug('searchStr=' + searchStr);

                ////////////////////
                // execute search //
                ////////////////////
                List<List <sObject>> searchList = search.query(searchStr);
                //System.debug('searchList=' + JSON.serializePretty(searchList));

                /////////////////////////
                // build response list //
                /////////////////////////
                SObject[] avList = (SObject[])searchList[0];
                i = 0;
                for (SObject av : avList)
                {
                    ArticleDetails ad = new ArticleDetails();

                    ad.id = (String)av.get('Id');
                    ad.articleNum = (String)av.get('ArticleNumber');
                    ad.title = (String)av.get('Title');

                    ad.lastUpdated = (Datetime)av.get('LastModifiedDate');
                    ad.urlName = (String)av.get('UrlName');
                    ad.summary = (String)av.get('Summary');

                    if (imageFieldAPIName != null) 
                    {
                        ad.image = (String)av.get(imageFieldAPIName);
                    }

                    if (answerFieldAPIName != null) 
                    {
                        ad.answer = (String)av.get(answerFieldAPIName);
                    }

                    if (chatAnswerFieldAPIName != null) 
                    {
                      ad.chatAnswer = (String)av.get(chatAnswerFieldAPIName);
                    }

                    if (i++ < MAX_COUNT) adList.add(ad);
                }
            }

            // Use Search class
            /*
             Search.KnowledgeSuggestionFilter filters = new Search.KnowledgeSuggestionFilter();
             filters.setLanguage('en_US');
             filters.setPublishStatus('Online');
             filters.setChannel('app');

             Search.SuggestionOption options = new Search.SuggestionOption();
             options.setFilter(filters);

             Search.SuggestionResults suggestionResults = Search.suggest('all', 'KnowledgeArticleVersion', options);

             for (Search.SuggestionResult searchResult : suggestionResults.getSuggestionResults()) {
             KnowledgeArticleVersion article = (KnowledgeArticleVersion)result.getSObject();
             System.debug(article.title);
             }
             */
        } catch (Exception e)
        {
            // do nothing
        }

        //System.debug('adList=' + JSON.serializePretty(adList));

        retVal = EncodingUtil.base64Encode(Blob.valueOf(JSON.serialize(adList)));

        return new List<String>{ retVal };
    }

    global class SearchRequest
    {
        @InvocableVariable(required = true)
        global String searchString;
        @InvocableVariable(required = false)
        global Integer maxCount = 5;
    }

    private class ArticleDetails
    {
        public String id;
        public String title;
        public String articleNum;
        public Datetime lastUpdated;
        public String urlName;
        public String image;
        public String chatAnswer;
        public String summary;
        public String answer;
        public Boolean updateFlag = false;
    }

}