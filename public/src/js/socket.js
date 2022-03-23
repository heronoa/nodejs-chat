const socket = io();

socket.on('user-ok', (list) => { // SEPARA EM OUTRO ARQUIVO SÓ PARA O SOCKET
    switchShow('chat');
    localStorage.removeItem('localUsername');
    textInput.focus();

    addMessage('status', null, "Conectado!")

    userList = list;
    renderUserList();

})

socket.on('list-update', (data) => {
    if(data.joined) {
        addMessage('status', null, data.joined+' entrou no chat!');
    }

    if(data.left) {
        addMessage('status', null, data.left+" saiu do chat.");
    }

    userList = data.list;
    renderUserList();
});

socket.on('show-msg', (data) => {
    addMessage('msg', data.username, data.message);
});
socket.on('warning-msg', () => {
    playSound('src/media/sounds/msg-alert.mp3');    
});

socket.on('disconnect', () => {
    addMessage('status', null, 'Você foi desconectado!')
    userList = [];
    renderUserList();
    localStorage.setItem('localUsername', username)
});

socket.on('reconnect_error', () => {
    addMessage('status', null, 'Tentando reconectar...')
})
socket.on('reconnect', () => {
    let username = localStorage.getItem('localUsername')
    addMessage('status', null, `${username} reconectado!`);
    if(username !== '') {
        socket.emit('join-request', username);
        localStorage.removeItem('localUsername');
    }
})