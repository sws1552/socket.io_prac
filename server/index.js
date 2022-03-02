const express = require('express');
const app = express()
const http = require('http');
const cors = require('cors');
const {Server} = require("socket.io");
app.use(cors());

const server = http.createServer(app);

// 소켓서버 localhost:3000번이랑 통신할거다~
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', "POST"],
    }
});

// 클라이언트와 통신되었을때 실행된다.
io.on("connection", (socket) => {
    console.log('연결된 사용자~ !! ', socket.id);

    // socket.emit("join_room", room); 클라이언트에서의 로직
    // data = room 이 된다.
    socket.on("join_room", (data) => {
        // 방 목록에 추가
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`)
    });

    // socket.on으로 클라이언트에서 메세지 데이터 받아온다.
    // 여기안에서 메세지 내용들을 저장하던가하면 좋을거같다.
    socket.on("send_message", (data) => {
        console.log("메시지 데이터 수신~! !! ",data);

        // 클라이언트로 전송할것이다~
        // 해당방에있는 유저들한테 모두 보이게 할것이다~
        socket.to(data.room).emit("receive_message",data);
    });

    // 통신이 끊겼을대 실행되는 함수쓰
    socket.on('disconnect', () => {
        console.log("연결끊긴 사용자~ !! ", socket.id);
    });

});

server.listen(5000, () => {
    console.log('server Running');
});

