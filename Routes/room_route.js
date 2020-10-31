const router = require('express').Router();
const user_Collection = require('../Models/user_model');
const room_Collection = require('../Models/room_model');
const isLogin = require('../Middlewares/isLogin');

// create room
router.post('/create_room', isLogin, (req, res) => {
    const { userId } = req.body;
    const myId = req.user._id;
    
    if(!userId) return res.json({error: 'we need userId'})

    if(userId.toString() === myId.toString()) return res.json({error: "can't create a room with your self"})

    const participants = [userId, myId];

    room_Collection.findOne({ participant1: {$in: participants }, participant2: {$in: participants } })
    .populate('participant1 participant2', '-password')
    .then(roomFound => {
        
        if(roomFound !== null) {
            return res.json({yourRoom: roomFound})
        }

        if(roomFound === null){
            const newRoom = new room_Collection({
                participant1: myId,
                participant2: userId
            })

            newRoom.save()
            .then(savedRoom => {
                room_Collection.findById(savedRoom._id)
                .populate('participant1 participant2', '-password')
                .then(newRoom => {
                    return res.json({
                        createRoom: 'Room successfuly created',
                        newRoom,
                    })
                })
                .catch(err => console.log('Room_route::41', err) )
                
            } )
            .catch(err => console.log('Room_route::44', err) )
    
        }
    } )
    .catch(err => console.log('Room_route::48', err) )
} )

module.exports = router;