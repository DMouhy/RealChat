import React, { useState } from 'react';
import './UnseenMsg.css';

function UnseenMsg({ me, view_other_messages, POST_active_user, unseen_messages, length }) {
    const [open_msgs, set_open_msgs] = useState(false);

    return (
        <>
        <div onClick={() => set_open_msgs(!open_msgs)} className={`unseen_msg_notify ${length !== 0 && 'unseen_msg_notify_go_down'}`} >
            {length} New
        </div>
        <div className={`unseen_msgs ${open_msgs && 'unseen_msgs_go_right'}`}>
            {
                unseen_messages.length !== 0 && (
                    unseen_messages.map((msg, index) => (
                        <div key={index} 
                        onClick={() => {
                            localStorage.setItem('active', msg.his_messages[0].info.send_by._id)
                            POST_active_user(msg.his_messages[0].info.send_by._id)
                            view_other_messages({
                                info: { send_by: { _id: msg.his_messages[0].info.send_by._id } },
                                talking_to: {
                                    _id: me._id,
                                    username: me.username
                                }
                            })
                            set_open_msgs(false);
                        }} 
                        className="unseen_msg"
                        >
                            <div className="unseen_msg_user">{msg.his_messages[0].info.send_by.username}</div>
                            <p className="unseen_msg_content">{msg.his_messages[msg.his_messages.length - 1].info.content}</p>
                            <div className="unseen_msg_length">{msg.his_messages.length}</div>
                        </div>
                    ))
                )
            }
        </div>
        </>
    )
}

export default UnseenMsg
