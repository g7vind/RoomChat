import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { io } from "socket.io-client";
import { useAuthContext } from '../context/AuthContext';
let socket;

const Room = () => {
    const [room, setRoom] = useState('');
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [members, setMembers] = useState([]);
    const { authUser } = useAuthContext(); 
    useEffect(() => {
        socket = io(host);
        socket.on('receive_message', (data) => {
            data.type = 'incoming';
            setMessages((prevMessages) => [...prevMessages, data]);
        });
        socket.on('room_members', (members) => {
            setMembers(members);
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    const connectToRoom = (e) => {
        e.preventDefault();
        const roomData={
            room:room,
            username:authUser.username
        }
        if (socket) {
            socket.emit('join_room', roomData);
            setLoggedIn(true);
            toast.success(`Connected to room ${room}`);
        } else {
            console.error('Socket is not initialized');
        }
    };

    const sendMessage = () => {
        if (message.trim()) {
            const msgData = {
                room,
                content: message,
                sender: authUser.username,
                type: 'outgoing',
                timestamp: new Date(),
            };
            socket.emit('send_message', msgData);
            setMessages((prevMessages) => [...prevMessages, msgData]);
            setMessage('');
        }
    };

    const leaveRoom = () => {
        socket.emit('leave_room', room);
        setLoggedIn(false);
        setRoom('');
        toast.info(`Left the room ${room}`);
    };

    return (
        <>
            {isLoggedIn ? (
                <div className="flex h-screen">
                    <Sidebar>
                        <h2 className="text-lg font-bold mb-4">Users</h2>
                        <ul className="space-y-2">
                            {members.map((member, index) => (
                                <li
                                    key={index}
                                    className="bg-gray-200 p-2 rounded-md cursor-pointer hover:bg-gray-300"
                                >
                                    {member.username}
                                </li>
                            ))}
                        </ul>
                        <button onClick={leaveRoom} className="mt-4 p-2 bg-red-500 text-white rounded">
                            Leave Room
                        </button>
                    </Sidebar>
                    <ChatSection>
                        <ChatMessages className="flex-1 overflow-y-scroll p-4">
                            <div className="space-y-4">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`chat ${msg.type === 'outgoing' ? 'chat-start' : 'chat-end'}`}>
                                        <div className={`chat-bubble ${msg.type === 'outgoing' ? 'chat-bubble-secondary' : 'chat-bubble-primary'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ChatMessages>
                        <ChatInputContainer className="border-t p-4 flex">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="input input-bordered w-full mr-2"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button className="btn btn-primary" onClick={sendMessage}>
                                Send
                            </button>
                        </ChatInputContainer>
                    </ChatSection>
                </div>
            ) : (
                <FormContainer>
                    <form onSubmit={connectToRoom}>
                        <input
                            type="text"
                            placeholder="Enter room name"
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                        />
                        <button type="submit">Connect</button>
                    </form>
                </FormContainer>
            )}
        </>
    );
};

const Sidebar = styled.div`
    width: 25%;
    background-color: white;
    padding: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    h2 {
        font-size: 1.5rem;
        font-weight: bold;
    }

    ul {
        margin-top: 1rem;
        list-style: none;
        padding: 0;
    }

    li {
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        background-color: #f1f1f1;
        border-radius: 0.25rem;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
            background-color: #ddd;
        }
    }

    button {
        margin-top: 1rem;
        width: 100%;
        padding: 0.5rem;
        background-color: #e74c3c;
        color: white;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
    }
`;

const ChatSection = styled.div`
    width: 75%;
    display: flex;
    flex-direction: column;
    background-color: white;
    padding: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const ChatMessages = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
`;

const ChatInputContainer = styled.div`
    display: flex;
    border-top: 1px solid #ddd;
    padding: 1rem;
    gap: 0.5rem;

    input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 0.25rem;
    }

    button {
        padding: 0.5rem 1rem;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
    }
`;

const FormContainer = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f1f1f1;

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        background-color: white;

        input {
            padding: 0.5rem;
            border-radius: 0.5rem;
            border: 1px solid lightgray;
        }

        button {
            padding: 0.5rem;
            border-radius: 0.5rem;
            border: none;
            background-color: #333;
            color: white;
            cursor: pointer;
        }
    }
`;

export default Room;
