global with sharing class PSChatBotPack_GetParams {
    @InvocableMethod(label='Get Config Param (PSChatBotPack)')
    global static List<String>  getParam(List<GetParamRequest> requests)
    {
        String retVal = null;
        try {
            if (requests.size() > 0)
            {
              PSChatBotPackParam__mdt param = PSChatBotPackParam__mdt.getInstance(requests[0].label);
              retVal = param.value__c;
            }
        } catch (Exception e) {
            // do nothing
        }

        return new List<String>{ retVal };

    }

    global class GetParamRequest {
        @InvocableVariable(required=true)
        global String label;
      }
}