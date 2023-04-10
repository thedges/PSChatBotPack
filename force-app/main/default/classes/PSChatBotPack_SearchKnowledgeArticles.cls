global with sharing class PSChatBotPack_SearchKnowledgeArticles {
   global static void test()
   {
     //String retStr = PSChatBotPack_SearchKnowledgeArticles.searchArticles('child care');
     //System.debug('retStr=' + retStr);
   }

   @InvocableMethod(label='Search Knowledge Articles (PSChatBotPack)')
   global static List<String> searchArticles(List<SearchRequest> requests)
   {
       Integer maxCount = 5;
       Integer i;
       String retVal = null;
       List<articleDetails> adList = new List<articleDetails>();

       try {
        if (requests.size() > 0)
            {
        // Use SOSL to search
        List<List<Knowledge__kav>> searchList = [FIND :requests[0].searchString IN ALL FIELDS RETURNING Knowledge__kav(Id, Title, Summary, UrlName, LastModifiedDate, Chat_Answer__c) LIMIT 5];

        Knowledge__kav[] avList = (Knowledge__kav[])searchList[0];

        i = 0;
        for(Knowledge__kav av : avList){
            // Do something with the article version, such as displaying its Title and Summary
            System.debug('Article Title: ' + av.Title);
            System.debug('Article Summary: ' + av.Summary);

            ArticleDetails ad = new ArticleDetails();
            ad.id = av.Id;
            ad.title = av.Title;
            ad.summary = av.Summary;
            ad.urlName = av.UrlName;
            ad.image = null;
            ad.chatAnswer = av.Chat_Answer__c;

            if (i++ < maxCount) adList.add(ad);
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

       retVal = JSON.serialize(adList);

       return new List<String>{ retVal };

   }

   global class SearchRequest {
       @InvocableVariable(required=true)
       global String searchString;
    }

    private class ArticleDetails {
        public String id;
        public String title;
        public String summary;
        public String urlName;
        public String image;
        public String chatAnswer;
    }
}