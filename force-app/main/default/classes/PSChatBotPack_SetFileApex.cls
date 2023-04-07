public with sharing class PSChatBotPack_SetFileApex {
    @AuraEnabled
    public static void setFileApex(String recordId, String fileId, String fileName, String bField, String commAccess){
  
      System.debug('setFileApex...');
      System.debug('recordId=' + recordId);
      System.debug('fileId=' + fileId);
      System.debug('fileName=' + fileName);
      System.debug('bField=' + bField);
  
        try {
            Boolean boolCommAccess = false;
            if (bField != null && bField.trim().length() == 0) bField = null;
            if (commAccess != null)
            {
              if (commAccess.trim().length() != 0 && commAccess.trim().toLowerCase() == 'true') 
              {
                  boolCommAccess = true;
              }
            }
  
            List<ContentVersion> fileList = [SELECT Id, Title FROM ContentVersion WHERE ContentDocumentId = :fileId];
           if (fileList != null && fileList.size() == 1)
           {
               fileList[0].Title = fileName;
           }
           update fileList;
  
           // update the boolean field on object
           if (bField != null)
           {
               Id tmpRecId = recordId;
               SObject obj = tmpRecId.getSObjectType().newSObject(tmpRecId);
               obj.put(bField, true);
               update obj;
  
           }
  
           // update document for community access
           if (boolCommAccess)
           {
               List<ContentDocumentLink> cdlList = [SELECT Id, ShareType, Visibility 
                                                      FROM ContentDocumentLink 
                                                     WHERE ContentDocumentId = :fileId 
                                                       AND LinkedEntityId = :recordId 
                                                       AND Visibility != 'AllUsers'];
               if (cdlList != null && cdlList.size() > 0)
               {
                   for (ContentDocumentLink cdl : cdlList)
                   {
                       cdl.Visibility = 'AllUsers';
                   }
                   update cdlList;
               }
           }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}