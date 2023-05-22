global with sharing class PSChatBotPack_SearchKnowledgeArticles {
   private static Integer MAX_LENGTH = 500;
   private static Integer MAX_COUNT = 10;

   global static void test()
   {
     //String retStr = PSChatBotPack_SearchKnowledgeArticles.searchArticles('child care');
     //System.debug('retStr=' + retStr);
   }

   @InvocableMethod(label='Search Knowledge Articles (PSChatBotPack)')
   global static List<String> searchArticles(List<SearchRequest> requests)
   {
       Integer i;
       String retVal = null;
       List<articleDetails> adList = new List<articleDetails>();

       try {
        if (requests.size() > 0)
            {
        // Use SOSL to search
        List<List<Knowledge__kav>> searchList = [FIND :requests[0].searchString IN ALL FIELDS RETURNING Knowledge__kav(Id, ArticleNumber, Title, Summary, UrlName, LastModifiedDate, Image__c, Answer__c, Chat_Answer__c) LIMIT :requests[0].maxCount];

        Knowledge__kav[] avList = (Knowledge__kav[])searchList[0];

        i = 0;
        for(Knowledge__kav av : avList){
            // Do something with the article version, such as displaying its Title and Summary
            System.debug('Article Title: ' + av.Title);
            System.debug('Article Summary: ' + av.Summary);
            System.debug('Article Answer: ' + av.Answer__c);

            ArticleDetails ad = new ArticleDetails();
            ad.id = av.Id;
            ad.articleNum = av.ArticleNumber;
            ad.title = av.Title;
            //ad.lastUpdated = av.LastModifiedDate.format('MMMMM dd, yyy');
            ad.lastUpdated = av.LastModifiedDate;
            ad.urlName = av.UrlName;
            ad.image = av.Image__c;

            ad.summary = av.Summary;
            ad.answer = av.Answer__c;
            ad.chatAnswer = av.Chat_Answer__c;

            /*
            if (av.Answer__c !=null)
            {
              //ad.summary = av.Answer__c.stripHtmlTags();
              ad.summary = av.Answer__c.replace('"', '\'');
            }
            
            if (ad.summary != null && ad.summary.length() > 0)
            {
                if (ad.summary.length() > MAX_LENGTH)
                {
                    ad.summary = ad.summary;
                    //ad.summary = ad.summary.substring(0,MAX_LENGTH) + '...';
                }
            }
            else if (ad.chatAnswer != null)
            {
               ad.summary = ad.chatAnswer;
            }
            else 
            {
                ad.summary = 'This knowledge article has no content. Please update.';
                ad.updateFlag = true;
            }
            */

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
    } catch (Exception e) {
        // do nothing
    }

       retVal = EncodingUtil.base64Encode(Blob.valueOf(JSON.serialize(adList)));

       return new List<String>{ retVal };

   }

   global class SearchRequest {
       @InvocableVariable(required=true)
       global String searchString;
       @InvocableVariable(required=false)
       global Integer maxCount = 5;
    }

    private class ArticleDetails {
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