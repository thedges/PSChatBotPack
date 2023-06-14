global with sharing class PSChatBotPack_GetJsonParam {
    public static void test()
    {
        Map<String, Object> testObj = new Map<String, Object>();
        testObj.put('integerValue', 1234);
        testObj.put('doubleValue', 1234.1234);
        testObj.put('booleanValue', false);
        testObj.put('dateValue', Date.today());
        testObj.put('dateTimeValue', DateTime.now());
        testObj.put('idValue', Id.valueOf('a413x00000058gyAAA'));
        System.debug(JSON.serialize(testObj));


        GetParamRequest req = new GetParamRequest();
        req.jsonString = '{"name1": "This is a string", "name2": 1234, "name3": 186.3938473, "name4": "", "name5": "", "name6":"", "name7": "false"}';
        req.fieldName = 'name1';

        List<GetParamResp> respList = getParam(new List<GetParamRequest> {req});
        System.debug('resp=' + JSON.serialize(respList));

        req.fieldName = 'name2';
        req.fieldType = 'Number';
        respList = getParam(new List<GetParamRequest> {req});
        System.debug('resp=' + JSON.serialize(respList));

        req.fieldName = 'name3';
        req.fieldType = 'Number';
        respList = getParam(new List<GetParamRequest> {req});
        System.debug('resp=' + JSON.serialize(respList));
    }

    @InvocableMethod(label='Get JSON Param (PSChatBotPack)')
    global static List<GetParamResp>  getParam(List<GetParamRequest> requests)
    {
        GetParamResp resp = new GetParamResp();
        String retVal = null;
        try {
            if (requests.size() > 0)
            {
               Map<String, String> mapBase = (Map<String, String>)JSON.deserialize(requests[0].jsonString, Map<String, String>.class);
               resp.stringValue = mapBase.get(requests[0].fieldName);

               if (requests[0].fieldType != null)
               {
                 if (requests[0].fieldType.toLowerCase() == 'id')
                 {
                    resp.idValue = Id.valueOf(resp.stringValue);
                 }
                 else if (requests[0].fieldType.toLowerCase() == 'string')
                 {
                    resp.idValue = resp.stringValue;
                 }
                 else if (requests[0].fieldType.toLowerCase() == 'integer')
                 {
                    resp.integerValue = Integer.valueOf(resp.stringValue);
                 }
                 else if (requests[0].fieldType.toLowerCase() == 'double')
                 {
                    resp.doubleValue = Double.valueOf(resp.stringValue);
                 }
                 else if (requests[0].fieldType.toLowerCase() == 'boolean')
                 {
                    resp.booleanValue = Boolean.valueOf(resp.stringValue);
                 }
                 else if (requests[0].fieldType.toLowerCase() == 'date')
                 {
                    resp.dateValue = Date.valueOf(resp.stringValue);
                 }
                 else if (requests[0].fieldType.toLowerCase() == 'datetime')
                 {
                    resp.dateTimeValue = DateTime.valueOf(resp.stringValue);
                 }
               }
            }
        } catch (Exception e) {
            // do nothing
        }

        return new List<GetParamResp>{ resp };

    }

    global class GetParamRequest {
        @InvocableVariable(required=true)
        global String jsonString;
        @InvocableVariable(required=true)
        global String fieldName;
        @InvocableVariable(required=false)
        global String fieldType;
      }

      global class GetParamResp {
        @InvocableVariable(required=true)
        global String stringValue;
        @InvocableVariable(required=false)
        global Integer integerValue;
        @InvocableVariable(required=false)
        global Double doubleValue;
        @InvocableVariable(required=false)
        global Boolean booleanValue;
        @InvocableVariable(required=false)
        global Date dateValue;
        @InvocableVariable(required=false)
        global DateTime dateTimeValue;
        @InvocableVariable(required=false)
        global ID idValue;
      }
}