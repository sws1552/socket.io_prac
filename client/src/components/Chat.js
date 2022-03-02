import React, { useState } from 'react';
import io from 'socket.io-client';
import ChatRoom from './ChatRoom';
import styeld from "styled-components";


// 소켓서버를 실행하는 URL과 같은 링크를 넣어야 한다. (백과 프론트 연결)
const socket = io.connect("http://localhost:5000");

const Chat = () => {

    const [userName, setUserName] = useState("");
    const [room, setRoom] = useState("");
    const [showChat, setShowChat] = useState(false);

    // 로그인한 사용자와 소켓 방사이의 연결을 설정
    const joinRoom = () => {

        // 유저이름과 방이 빈값이 아닐때만
        if(userName !== "" && room !== ""){
            setShowChat(true);
            // 서버에 데이터 전송
            socket.emit("join_room", room);
        }
    }

    return (
        <Container>
            {!showChat ? (
            <React.Fragment>
                <h3>A Chat</h3>
                <input type="text" placeholder='User ID' onChange={(e) => setUserName(e.target.value)}/>
                <input type="text" placeholder='Room ID' onChange={(e) => setRoom(e.target.value)}/>
                <button onClick={joinRoom}>A 방 참가 ㄱ</button>
            </React.Fragment>
            ) : (
                <ChatRoom socket={socket} userName={userName} room={room}/>
            )}
        </Container>
    );
};


const Container = styeld.div`
    margin: 100px auto 0;
    width: 420px;
    height: 500px;
    text-align: center;
    font-family: "Open Sans", sans-serif;
    background-color: beige;
    display: flex;
    flex-direction: column;
    text-align: center;
`;


export default Chat;