import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ScrollToBottom from "react-scroll-to-bottom";


const ChatRoom = ({socket, userName, room}) => {

    const [curMsg, setCurMsg] = useState("");
    const [msgList, setMessageList] = useState([]);

    // 비동기로 만들어서 메시지가 실제로 업데이트를 할 때까지 기다리도록 한다
    const sendMessage = async () => {
        if(curMsg !== "") {
            const msgData = {
                room: room,
                author: userName,
                message: curMsg,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            }

            // 서버에 메시지 데이터 전송
            await socket.emit("send_message", msgData);

            setMessageList((list) => {
                console.log('내가 보낸 메시지 ~~!! ', list);
                return [...list, msgData];
            })

        }

        setCurMsg("");

    }

    // 소켓서버에 변경사항이 있을때마다 내부함수 실행
    useEffect(() => {
        // 백단에서 데이터 받아오기
        socket.on("receive_message", (data) => {
            console.log("상대방 메시지 수신~!! ", data);
            setMessageList((list) => {
                console.log('set하기전 state값 !! ', list);
                return [...list, data];
            });
        });

    }, [socket]);

    return (
        <Container>
            <div className='chat-header'>
                <p>실시간 채팅</p>
            </div>
            <ChatBody>
                <ScrollToBottom className="msg-container">
                    {msgList.map((item, i) => {
                        return (
                            <Message key={`msgKey${i}`} className={userName === item.author ? "me" : "other"}>
                                <div>
                                    <UserCon className={userName === item.author ? "me" : "other"}>{item.author}</UserCon>
                                    <MsgCon className={userName === item.author ? "me" : "other"}>
                                        <p>{item.time}</p>                                        
                                        <MessageContent className={userName === item.author ? "me" : "other"}>
                                            <p>{item.message}</p>
                                        </MessageContent>
                                    </MsgCon>
                                </div>
                            </Message>
                        )
                    })}
                </ScrollToBottom>
            </ChatBody>
            <div className='chat-footer'>
                <input type="text" value={curMsg} placeholder='내용 입력 하세요' onChange={(e) => setCurMsg(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}/>
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </Container>
    );
};

const Container = styled.div`

    & .msg-container {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }

`;

const Message = styled.div`
    height: auto;
    padding: 10px;
    display: flex;
    justify-content: ${(props) => (props.className === 'me' ? "flex-end" : "flex-start")};
`;

const UserCon = styled.div`
    display: flex;
    justify-content: ${(props) => (props.className === 'me' ? "flex-end" : "flex-start")};
`;

const MsgCon = styled.div`
    display: flex;
    flex-direction: ${(props) => (props.className === 'me' ? "row" : "row-reverse")};
`;

const MessageContent = styled.div`
    width: auto;
    height: auto;
    min-height: 40px;
    max-width: 120px;
    background-color: ${(props) => (props.className === 'me' ? "#ffeb33" : "#fff")};
    border-radius: 5px;
    color: black;
    display: flex;
    align-items: center;
    margin-right: 5px;
    margin-left: 5px;
    padding-right: 5px;
    padding-left: 5px;
    overflow-wrap: break-word;
    word-break: break-word;
    box-shadow: 1px 1px 1px 1px gray;
`;


const ChatBody = styled.div`
    /* height: calc(450px - (45px + 70px)); */
    height: 400px;
    /* border: 1px solid #263238; */
    background: #b2c7d9;
    position: relative;

`;

export default ChatRoom;