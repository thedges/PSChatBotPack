public without sharing class PSChatBotPack_ArticleVote {
    @AuraEnabled
    public static void voteArticle(String articleNum, String voteUpDown) {
  
      System.debug('voteArticle...');
      System.debug('articleNum=' + articleNum);
      System.debug('voteUpDown=' + voteUpDown);

      Boolean updateVote = false;

      Knowledge__ka ka = [SELECT Id, ArticleNumber  FROM Knowledge__ka WHERE ArticleNumber=:articleNum];

      List<Vote> vList = [SELECT Id, Type FROM Vote WHERE ParentId = :ka.Id AND LastModifiedById = :UserInfo.getUserId()];
      if (vList == null || vList.size() == 0)
      {
         Vote v = new Vote();
         v.ParentId = ka.Id;
         if (voteUpDown == 'Up')
         {
           v.Type = '5';
         }
         else {
           v.Type = '1';
         }
         insert v;
      }
      else {
        Vote v = vList[0];
        if (voteUpDown == 'Up')
        { 
            if (v.Type != '5')
            {
              v.Type = '5';
              updateVote = true;
            }
        }
        else {
            if (v.Type != '1')
            {
              v.Type = '1';
              updateVote = true;
            }
        }
        if (updateVote) update v;
      }
    }

}