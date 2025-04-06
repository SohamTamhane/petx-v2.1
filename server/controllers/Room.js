const Room = require('../models/Room');
const User = require('../models/User');

exports.createRoom = async (req, res) => {
    try {
        const { cost, duration } = req.body;
        const user = req.user;

        if(user.type === "Caretaker"){
            return res.status(401).json({
                success: false,
                message: "Restricted Action for Caretaker"
            });
        }

        if(!cost || !duration){
            return res.status(401).json({
                success: false,
                message: "Please Fill All the Details"
            });
        }

        const response = await Room.findOne({name: user.id});
        if(response){
            await Room.findOneAndDelete({name: user.id});
        }

        const room = await Room.create({name: user.id, cost: cost, duration: duration});

        await User.findByIdAndUpdate(user.id, { room: room._id });
        await User.findOneAndUpdate({type: "Caretaker"}, { room: room._id });

        //   const room = new Room({
        //     name,
        //     members: [userId],
        //   });

        //   await room.save();

        //   // Update user's room
        //   await User.findByIdAndUpdate(userId, { room: room._id });

        //   res.status(201).json(room);

        return res.status(200).json({
            success: true,
            message: "Room Created Successfully",
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
};