import React, { useEffect, useState, useRef } from 'react';
import './MainApp.css';
import { Avatar } from '@material-ui/core';
import BaseUrl from '../BaseUrl';
import io from 'socket.io-client';
import AlertMessage from '../Components/AlertMessage';
import { FaEye } from 'react-icons/fa';
import UnseenMsg from '../Components/UnseenMsg';

let socket = io(`${BaseUrl}`);

function MainApp() {
    // states
    const [me, set_me] = useState({});
    const [users, set_users] = useState([]);
    const [active_user, set_active_user] = useState({});
    const [users_go_right, set_users_go_right] = useState(false);
    const [alert_message, set_alert_message] = useState({ type: '', message: '' });
    const [room_messages, set_room_messages] = useState([]);
    const [roomId, set_roomId] = useState('');
    const [message, set_message] = useState('');
    const [unseen_messages, set_unseen_messages] = useState([]);
    const [is_writing, set_is_writing] = useState({});

    // References
    const room_body = useRef();

    // check login permission
    useEffect(()  => GET_check_permision(), []);
    function GET_check_permision(){

        const token = localStorage.getItem('token') || '';
        fetch(`${BaseUrl}/api/check_permission`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer${token}` }
        })
        .then(res => res.json())
        .then(res => {
            if(res.TokenError){
                localStorage.clear();
                window.location.reload(false);
            }
            if(res.me){
                set_me(res.me);
                GET_unseen_messages();
            }
        })
    }
    // get unseen messages
    function GET_unseen_messages(){
        const token = localStorage.getItem('token') || '';
        fetch(`${BaseUrl}/api/unseen_messages`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer${token}` }
        })
        .then(res => res.json())
        .then(res => {
            if(res.TokenError){
                localStorage.clear();
                window.location.reload(false);
            }
            if(res.unseenMessages && res.unseenMessages.length !== 0){
                let copy_unseen_mes = [];
                res.unseenMessages.forEach(msg => {
                    let his_msgs = [];
                    msg.noViewed_messages.forEach(noViewed_msg => {
                        his_msgs.push({
                            info: {
                                send_by: {
                                    _id: msg.talked_to._id,
                                    username: msg.talked_to.username
                                },
                                content: noViewed_msg.content
                            }
                        })
                    })
                    copy_unseen_mes.push({
                        his_messages: his_msgs
                    })
                })
                set_unseen_messages(copy_unseen_mes);
            }
        })
    }

    // get all users &&
    useEffect(() => {
        if(me){
            socket_connect();
            GET_all_users();
        }   
    }, [me]);
    function GET_all_users(){

        const token = localStorage.getItem('token') || '';
        fetch(`${BaseUrl}/api/all_users`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer${token}` }
        })
        .then(res => res.json())
        .then(res => {
            if(res.TokenError){
                localStorage.clear();
                window.location.reload(false);
            }
            if(res.users){
                set_users(res.users)
            }
        })
    }
    function socket_connect(){
        socket.emit('user_connect', { user: me })
        socket.on('welcome', msg => {
            set_alert_message({...alert_message, message: msg})
            setTimeout(() => set_alert_message({ type: '', message: '' }), 3000)
        } )
        socket.on('someoneConnected', msg => {
            set_alert_message({...alert_message, message: msg});
            setTimeout(() => set_alert_message({ type: '', message: '' }), 3000);
            GET_all_users();
        } )
    }

    // get_active_user
    function POST_active_user(userId){

        fetch(`${BaseUrl}/api/active_user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        })
        .then(res => res.json())
        .then(res => {
            if(res.active_user){
                set_active_user(res.active_user)
                POST_create_room(res.active_user._id);
            }
        })
    }

    // change room
    function POST_create_room(userId){
        const token = localStorage.getItem('token') || '';
            
        fetch(`${BaseUrl}/api/create_room`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer${token}`
            },
            body: JSON.stringify({ userId })
        })
        .then(res => res.json())
        .then(res => {
            if(res.TokenError){
                console.log('errorToken')
                localStorage.clear();
                window.location.reload(false);
            }
            if(res.yourRoom){
                set_room_messages([])
                POST_room_messages(res.yourRoom._id)
                set_roomId(res.yourRoom._id)
            }
            if(res.newRoom){
                set_room_messages([])
                POST_room_messages(res.newRoom._id)
                set_roomId(res.newRoom._id)
            }
            })
    }

    function POST_room_messages(roomId){

        const token = localStorage.getItem('token') || '';
        fetch(`${BaseUrl}/api/room_messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer${token}`
            },
            body: JSON.stringify({roomId})
        })
        .then(res => res.json())
        .then(res => {
            if(res.TokenError){
                console.log('errorToken')
                localStorage.clear();
                window.location.reload(false);
            }
            if(res.RoomMessages){
                let un_messages = []
                res.RoomMessages.forEach((msg, index) => {
                    un_messages.push({
                        info : {
                            send_by: { 
                                username: msg.msg.send_by.username, 
                                _id: msg.msg.send_by._id 
                            },
                            content: msg.msg.content,
                            Date_created_at: msg.msg.Date_created_at,
                            Time_created_at: msg.msg.Time_created_at,
                            viewed: msg.msg.viewed
                        },
                        talking_to: {
                            username: res.talkingWith.username, 
                            _id: res.talkingWith._id 
                        },
                        is_mine: msg.isMsgMine
                    })
                })
                set_room_messages(un_messages)
            }
        })
    }

    // scroll bottom
    useEffect(() => {
        room_body.current.scrollTop = room_body.current.scrollHeight;
    }, [room_messages])

    // send message
    socket.off('setting_message').on('setting_message', data => {
        data.msg.is_mine = me._id === data.msg.info.send_by._id;
        if(active_user._id === data.msg.info.send_by._id){
            view_other_messages(data.msg);
            set_room_messages([...room_messages, data.msg]);
        }
        else{
            set_alert_message({ type: '', message: 'New message' })
            setTimeout(() => set_alert_message({ type: '', message: '' }), 3000)

            if(unseen_messages.length !== 0){
                let copy_unseen_msg = [...unseen_messages];
                let msg_user_found = false;

                copy_unseen_msg.map(msg => {
                    if(data.msg.info.send_by._id === msg.his_messages[0].info.send_by._id){
                        msg.his_messages.push(data.msg);
                        msg_user_found = true;
                        return;
                    }
                })
                if(msg_user_found) {
                    set_unseen_messages(copy_unseen_msg);
                    msg_user_found = false;
                }
                else{
                    set_unseen_messages([{
                        his_messages: [data.msg]
                    }, ...unseen_messages]);
                    msg_user_found = false;
                }
            }
            else{
                set_unseen_messages([{
                    his_messages: [data.msg]
                }, ...unseen_messages]);
            }
        }
    } );
    function send_message(e){
        e.preventDefault();

        if(message && Object.entries(active_user).length !== 0 && roomId !== '')
        {
            console.log('send')
            // send to other client
            const msg = {
                info : {
                    send_by: { 
                        username: me.username, 
                        _id: me._id 
                    },
                    content: message.trim(),
                    Date_created_at: new Date().toUTCString(),
                    Time_created_at: `${new Date().getHours()}:${new Date().getMinutes()}`,
                    viewed: false
                },
                talking_to: {
                    username: active_user.username, 
                    _id: active_user._id 
                },
                is_mine: true,
            }
            set_room_messages([...room_messages, msg]);
            socket.emit('getting_message', { msg });

            // Store message
            const token = localStorage.getItem('token') || '';
            fetch(`${BaseUrl}/api/add_message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer${token}`
                },
                body: JSON.stringify({ 
                    roomId, 
                    content: message.trim()
                })
            })
            .then(res => res.json())
            .then(res => {
                if(res.TokenError){
                    console.log('errorToken')
                    localStorage.clear();
                    window.location.reload(false);
                }
            })

            // clear input
            set_message('');
        }
    }

    // view other message && my messages viewed
    useEffect(() => {
        let still_unseen_messages = unseen_messages.filter(msg => msg.his_messages[0].info.send_by._id !== active_user._id);
        set_unseen_messages(still_unseen_messages);
    }, [active_user])
    
    function view_other_messages(msg_viewed){
        socket.emit('view_message', msg_viewed);
    }
    socket.off('msg_viewed').on('msg_viewed', data => {
        if(active_user._id === data.viewed_by._id){
            let room_msg_copy = [...room_messages];
            let iterations = 0;
            for(let i=room_msg_copy.length - 1 ; i >= 0 ; i--){
                if(iterations === 20) break;
                if(room_msg_copy[i].info.send_by._id === me._id){
                    room_msg_copy[i].info.viewed = data.bool_viewed;
                    iterations++;
                }
                else continue;
            }
            set_room_messages(room_msg_copy);
        }
    });

    // is writing
    useEffect(() => {
        if(Object.entries(me).length !== 0 && Object.entries(active_user).length !== 0){
            socket.emit('isWriting', { writing: me, writing_to: active_user, is_writing: message })
        }
    }, [message]);
    socket.off('someoneWriting').on('someoneWriting', data => {
        if(data.is_writing){
            set_is_writing({...is_writing, [data.writing._id]: data.is_writing})
        }
        else{
            let copy_is_writing = {...is_writing};
            delete copy_is_writing[data.writing._id];
            set_is_writing(copy_is_writing);
        }
    })

    if(me) return (
        <>
        <AlertMessage content={alert_message.message} type={alert_message.type} />
        <UnseenMsg me={me} view_other_messages={view_other_messages} POST_active_user={POST_active_user} unseen_messages={unseen_messages} set_unseen_messages={set_unseen_messages} length={unseen_messages.length} />

        <div onClick={() => set_users_go_right(!users_go_right)} className="set_users_go_right">{users_go_right ? '<' : '>'}</div>
        <div className='main_app' >
            {/* part1: users list */}
            <div className={`users ${users_go_right && 'users_go_right'}`}>
                <div onClick={() => {
                    localStorage.clear();
                    window.location.reload(false);
                }} className="me">{me.username}</div>
                <div className="users_list">
                    {
                        users.length !== 0 && (
                            users.map(user => (
                                <div 
                                onClick={() => {
                                    localStorage.setItem('active', user._id)
                                    POST_active_user(user._id)
                                    view_other_messages({
                                        info: { send_by: { _id: user._id } },
                                        talking_to: { 
                                            _id: me._id,
                                            username: me.username
                                         }
                                    })
                                    set_users_go_right(false)
                                }} 
                                key={user._id} className="user">
                                <Avatar className='avatar' 
                                />
                                    {
                                        user.is_connected && (
                                        <div className="connected"></div>
                                        )
                                    }
                                    <div className="flex">
                                        <p>{user.username}</p>
                                        {
                                        (user._id in is_writing) && (
                                            <div className="isWriting">is writing...</div>
                                        )
                                        }
                                    </div>
                                </div>
                            ))
                        )
                    }
                </div>
            </div>

            {/* part2: room */}
            <div className="room">
                <div className="room_header">
                    {
                        active_user && (
                            <>
                            <Avatar className='avatar' />
                            { active_user.is_connected && <div className="connected"></div> }
                            <p>{active_user.username}</p>
                            </>
                        )
                    }
                </div>

                <div ref={room_body} className="room_body">
                    {
                        room_messages.length !== 0 && (
                            room_messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.is_mine && 'msg_mine'}`}>
                                    <div className="message_user">{msg.info.send_by.username}</div>
                                    <p>{msg.info.content}</p>
                                    <div className="time">{msg.info.Time_created_at}</div>
                                    {
                                        msg.is_mine && (
                                        <div className={`msg_is_viewed ${msg.info.viewed && 'msg_viewed'}`}><FaEye /></div>
                                        )
                                    }
                                </div>
                            ))
                        )
                    }
                </div>

                {/* send message */}
                <form onSubmit={(e) => send_message(e)} className="room_footer">
                    <input onChange={(e) => set_message(e.target.value) } type="text" placeholder='Send message...' value={message} />
                    <button type='submit' >Send</button>
                </form>
            </div>
        </div>
        </>
    )
    else return <div></div>
}

export default MainApp
