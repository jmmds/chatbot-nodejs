const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

const assistant = new AssistantV2({
  version: '2021-06-14',
  authenticator: new IamAuthenticator({
    apikey: 'XXXX',
  }),
  serviceUrl: 'XXXX',
});


const express = require ('express');


const app = express();

app.use(express.json()) //For JSON requests
app.use(express.urlencoded({extended: true}));

app.use(express.static('./public'));

const port = 3000;
var sId;

assistant.createSession({
    assistantId: 'XXXX'
  })
    .then(res => {
        console.log(res.result.session_id.toString());
        sId = res.result.session_id.toString();
    })
    .catch(err => {
      console.log(err);
    });




app.post('/watson/message/', async (req, res) => {
	const { message} = req.body;


    console.log(message)
	// payload
	const payload = { 
    assistantId: 'XXXX',
    sessionId: sId,
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
       console.log(result)
       console.log(response)
    
   } catch (e) {
       console.log(e)
   }

}) 




app.listen(port, () => console.log(`Running on port ${port}`));
