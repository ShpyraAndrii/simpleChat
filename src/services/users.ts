interface User {
    id: string;
    user_name: string;
    room: string;
}

const users: User[] = [];

const joinUser = (user: User) => {
    users.push(user);
    return user;
};

const getCurrentUser = (id: string): User | undefined => {
    return users.find((user) => user.id === id);
};

const removeUser = (id: string): User | undefined => {
    const idx = users.findIndex((u) => u.id === id);
    if (idx !== -1) {
        return users.splice(idx, 1)[0];
    }
};

const getRoomUsers = (room: string): User[] => users.filter((u) => u.room === room);

module.exports = {
    joinUser,
    getCurrentUser,
    removeUser,
    getRoomUsers,
};
