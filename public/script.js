const textInput = document.getElementById('textInput');
const chat = document.getElementById('chat');

let context = {};

const templateChatMessage = (menssage, from) => `
  <div class="from-${from}">
    <div class="message-inner">
      <p>${menssage}</p>
    </div>
  </div>
  `;

const InsertTemplateInTheChat = (template) => {
  const div = document.createElement('div');
  div.innerHTML = template;

  chat.appendChild(div);
};

const getWatsonMessageAndInsertTemplate = async (message = 'oi') => {
  var uri = 'http://localhost:3000/watson/message/';
  

  const response = await (await fetch(uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
   		   
    	message,
      	context,
    }),
  })).json();

  context = response.context;

  const template = templateChatMessage(response.response, 'watson');

  InsertTemplateInTheChat(template);
};

textInput.addEventListener('keydown', (event) => {
  if (event.keyCode === 13 && textInput.value) {
    getWatsonMessageAndInsertTemplate(textInput.value);

    const template = templateChatMessage(textInput.value, 'user');
    InsertTemplateInTheChat(template);
    
    textInput.value = '';
  }
});

getWatsonMessageAndInsertTemplate();