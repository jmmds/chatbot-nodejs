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
    apikey: '',
  }),
  serviceUrl: '',
});

app.get("/watson/session/", async (req, res) => {
   try {
       const session = await assistant.createSession({
           assistantId: ''
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
    assistantId: '',
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
