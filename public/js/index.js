const chat_form = document.getElementById('chat_form');
const chat_messages = document.querySelector('.chat_messages');
const room_name = document.getElementById('room_name');
const users_list = document.getElementById('users');

const socket = io();

const { user_name, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

socket.emit('join_room', { user_name, room });

const scrollDown = () => (chat_messages.scrollTop = chat_messages.scrollHeight);
const clearInput = () => (chat_form.elements.message.value = '');
const focusInput = () => chat_form.elements.message.focus();
const outputMessage = ({ user_name = '', text = '', time = '' }) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class='meta'>
                        <span class='user_name'>${user_name}<span/>
                        <span class='time'>${time}<span/>
                    <p/>
                    <p class='text'>${text}<p/>`;
    chat_messages.appendChild(div);
};
const outputRoomName = (room) => {
    room_name.innerHTML = room;
};
const outputRoomUsers = (users) => {
    console.log(users);
    users_list.innerHTML = `
        ${users.map((u) => `<li>${u.user_name}<li/>`).join('')}
    `;
};

// Listen to updates on users in the room
socket.on('users_in_room', ({ room, users }) => {
    outputRoomName(room);
    outputRoomUsers(users);
});

// Listen for new messages from the server
socket.on('message', (message) => {
    outputMessage(message);
    scrollDown();
});

// on message submit
chat_form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.elements.message.value;
    // Emit message to server
    socket.emit('new_message', message);
    clearInput();
    focusInput();
});
