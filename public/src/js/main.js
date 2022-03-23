let username = '';
let userList = [];

let loginPage = document.querySelector('#loginPage');
let chatPage = document.querySelector('#chatPage');

let loginInput = document.querySelector('#loginNameInput');
let textInput = document.querySelector('#chatTextInput');


function switchShow(pageToShow) {

    switch (pageToShow) {
        case 'login':
            loginPage.classList.remove('show');
            chatPage.classList.remove('show'); 

            loginPage.classList.add('show'); 

            loginPage.classList.remove('noShow')
            chatPage.classList.add('noShow'); 
            break;
        case 'chat':
            loginPage.classList.remove('show');
            chatPage.classList.remove('show');


            chatPage.classList.add('show'); 

            loginPage.classList.add('noShow')
            chatPage.classList.remove('noShow'); 
            break;

    }
    

}

function renderUserList() {
    let ul = document.querySelector('.userList');
    ul.innerHTML = '';

    userList.forEach(i => {
        ul.innerHTML += '<li>'+i+'</li>';
    });
}

function addMessage(type, user, message) {
    let ul = document.querySelector('.chatList');
    
    switch(type) {
        case 'status':
            ul.innerHTML += `<li class="m-status">${message}</li>`;
        break;
        case 'msg':
            if(username == user) {
                ul.innerHTML += `<li class="m-txt"><span class="me">${user}:</span> ${message}</li>`;  
            } else {
                ul.innerHTML += `<li class="m-txt"><span>${user}:</span> ${message}</li>`;
            }
        break
    }

    ul.scrollTop = ul.scrollHeight;
}

function playSound(url) {
    const audio = new Audio(url);
    audio.play();
  }

switchShow('login');

loginInput.addEventListener('keyup', (event) => {
    if(event.keyCode === 13) {
        let name = loginInput.value.trim();
        if(name != '') {
            username = name;
            document.title = 'Chat ('+username+')';

            socket.emit('join-request', username);
        }
    }
});

textInput.addEventListener('keyup', (event) => {
    if(event.keyCode === 13) {
        let text = textInput.value.trim();
        textInput.value='';

        if(text != '') {
            //addMessage('msg', username, txt); Assim a mensagem é enviando primeiro pra quem enviou e depois pras outras pessoas (remover o emit do servidor)
            socket.emit('send-msg', text);
        }
    }
})