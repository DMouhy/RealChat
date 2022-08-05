import React from 'react';
import './AlertMessage.css';

function AlertMessage({content, type}) {
    if(content) return (
        <div className={`alert_message ${type === 'error' && 'error'} ${content && 'alert_message_go_down'}`} >
            {content}
        </div>
    )
    else return <div className='alert_message' ></div>
}

export default AlertMessage
