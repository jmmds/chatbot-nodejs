const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const express = require ('express');


const app = express();

app.use(express.json()) //For JSON requests
app.use(express.urlencoded({extended: true}));

app.use(express.static('./public'));

const port = 3000;

const assistant = new AssistantV2({
  version: '2021-06-14',
  authenticator: new IamAuthenticator({
    apikey: 'aZWCyZYpnKSdlyir8KZzxZCqtAwJbvCqZXklM-CC1rhO',
  }),
  serviceUrl: 'https://api.us-south.assistant.watson.cloud.ibm.com/instances/493361d8-7bc4-4acf-8f14-8dfb66e0a394',
});

app.get("/watson/session/", async (req, res) => {
   try {
       const session = await assistant.createSession({
           assistantId: '659cacde-07ee-4485-b033-d22d6c8a5939'
       })
       res.json(session['result'])
   } catch (e) {
       res.send("Session creation not successful");
       console.log(e);
   }
});

app.post('/watson/message/', async (req, res) => {
	const { message, sessionId} = req.body;

	// payload

	const payload = { 
    assistantId: '659cacde-07ee-4485-b033-d22d6c8a5939',
    sessionId,
    input: {
   		 message_typer: "text",
    	 text: message,
    
    }
}
    try {
       // Send data to Watson Assistant
       // Access result property in response
      const { result } = await assistant.message(payload)
       // Access response text nested in object
       const response = result?.output?.generic[0]?.text || "";
       // return response
       res.json({
           response
       })
   } catch (e) {
       console.log(e)
   }
}) 

app.listen(port, () => console.log(`Running on port ${port}`));
