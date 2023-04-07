global with sharing class PSChatBotPack_GetParams {
    global static void test()
    {
        String val = getParam('GoogleMapsAPIKey');
        System.debug('value=' + val);
        val = getParam('BadLabel');
        System.debug('value=' + val);

    }

    //@InvocableMethod(label='Get Config Param (PSChatBotPack)')
    global static String getParam(String label)
    {
        String retVal = null;
        try {
            PSChatBotPackParam__mdt param = PSChatBotPackParam__mdt.getInstance(label);
            retVal = param.value__c;
        } catch (Exception e) {
            // do nothing
        }

        return retVal;

    }

    global class getParamRequest {
        @InvocableVariable(required=true)
        global String label;
      }
}