const router = require('express').Router();
const message_Collection = require('../Models/message_model');
const room_Collection = require('../Models/room_model');
const isLogin = require('../Middlewares/isLogin');

// create message
router.post('/add_message', isLogin, (req, res) => {
    const { roomId, content } = req.body;
    console.log(roomId)
    console.log(content)

    if(!content) return res.status(422).json({error: 'need content'});
    if(!roomId) return res.status(422).json({error: 'need roomId'});

    let d = new Date();
    let timeNow = `${d.getHours()}:${d.getMinutes()}`;

    const new_message = new message_Collection({
        content,
        send_by: req.user,
        viewed: false,
        Date_created_at: new Date().toUTCString(),
        Time_created_at: timeNow
    })

    new_message.save()
    .then(saved_message => {
        room_Collection.findByIdAndUpdate(roomId, {
            $push: { messages: saved_message }
        }, { new: true })
        .then(room => res.json({ message: 'message successfuly added', room }) )
        .catch(err => console.log('no room with this id ', err) )
    })
    .catch(err => console.log('ERROR:message_router::31: ', err))
})

// get Room Messages
router.post('/room_messages', isLogin, (req, res) => {
    const { roomId } = req.body;

    if(!roomId) return res.json({error: 'give all fields'})

    room_Collection.findById(roomId)
    .populate('participant1 participant2', '-password')
    .then(room => {

        // check if is my room
        if(room.participant1._id.toString() !== req.user._id.toString() && room.participant2._id.toString() !== req.user._id.toString()) {
            console.log('not your Room')
            return res.json({notYours: 'not your Room'});
        }

        // specify who i'm talkin with in that room :: the function is outside down
        function talking(){
            if(room.participant1._id.toString() === req.user._id.toString()) return room.participant2
            else return room.participant1
        }        
        const talkingWith = talking();

        // check if room messages not empty
        if(room.messages.length === 0){
            res.json({
                room,
                talkingWith,
                RoomMessages: []
            })
        }

        // find all room messages
        message_Collection.find({ _id: { $in: room.messages } })
        .populate('send_by', '-password')
        .sort('-Date_created_at')
        .then(messages => {

            let RoomMessages = [];

            messages.map( msg => {

                // is this message mine
                function isMine(){
                    if(msg.send_by._id.toString() === req.user._id.toString()) return true
                    else return false
                }
                const isMsgMine = isMine();

                // if msg not mine && msg.viewed === false update all messages as viewed === true
                if(!isMsgMine && !msg.viewed){

                    message_Collection.findByIdAndUpdate(msg._id, {
                        $set: { viewed: true }
                    }, { new: true })
                    .populate('send_by', '-password')
                    .sort('Date_created_at')
                    .then(rslt => {
        
                        RoomMessages.push({
                            msg: rslt,
                            isMsgMine
                        })
                        
                        if(RoomMessages.length == messages.length){
                            const newMessages = RoomMessages.sort((a, b) => {return a.msg.Date_created_at - b.msg.Date_created_at  })
                            res.json({
                                room,
                                talkingWith,
                                RoomMessages: newMessages
                            })
                        }
    
                    })
                }
                else{

                    RoomMessages.push({
                        msg,
                        isMsgMine
                    })
                    
                    if(RoomMessages.length == messages.length){
                        const newMessages = RoomMessages.sort((a, b) => {return a.msg.Date_created_at - b.msg.Date_created_at  })
                        res.json({
                            room,
                            talkingWith,
                            RoomMessages: newMessages
                        })
                    }

                }

            })
    
        })
    } ).catch(err => res.json({error: 'no room with this id'}))
} )

// unseen messages
router.get('/unseen_messages', isLogin, (req, res) => {

    room_Collection.find({ $or:  [{participant1: req.user._id}, {participant2: req.user._id}] })
    .populate('participant1 participant2', 'username')
    .then(rooms => {
        // check if room is empty
        if(rooms.length === 0) {
            return res.json({mesg: 'no room', unseenMessages: []})
        }
        
        let unseenMessages = [];
        rooms.map((room, index) => {

            // specify who i'm talking with in that room :: the function is outside down
            function talking(){
                if(room.participant1._id.toString() === req.user._id.toString()) return room.participant2
                else return room.participant1
            }            
            const talked_to = talking()

            if(room.messages !== []){

                message_Collection.find({ $and: [{_id: { $in: room.messages }}, {viewed: false}, { send_by: { $ne: req.user._id } }] })
                .sort('-Date_created_at')
                .then(messagesFound => {
                    if(messagesFound.length !== 0){
                        unseenMessages.push({
                            talked_to,
                            room,
                            noViewed_messages: messagesFound
                        })

                        if(rooms[index + 1] === undefined){
                            return res.json({unseenMessages})
                        }
                    }
                    else{
                        if(rooms[index + 1] === undefined){
                            return res.json({mesg: 'no room2', unseenMessages})
                        }
                        else return;
                    }
                })
                .catch(err => {
                    console.log('message Route:: 170', err)
                    if(rooms[index + 1] === undefined){
                        return res.json({mesg: 'no room2', unseenMessages})
                    }
                    else return;
                })

            }
            else {
                return res.json({mesg: 'no room3', unseenMessages: []})
            }
        })

    } )
    .catch(err => console.log('message_route::190::', err) )

} )

module.exports = router;