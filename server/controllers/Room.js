const Room = require('../models/Room');
const User = require('../models/User');

exports.createRoom = async (req, res) => {
    try {
        const { cost, duration } = req.body;
        const user = req.user;

        if (user.type === "Caretaker") {
            return res.status(401).json({
                success: false,
                message: "Restricted Action for Caretaker"
            });
        }

        if (!cost || !duration) {
            return res.status(401).json({
                success: false,
                message: "Please Fill All the Details"
            });
        }

        const response = await Room.findOne({ name: user.id });
        if (response) {
            await Room.findOneAndDelete({ name: user.id });
        }

        const room = await Room.create({ name: user.id, cost: cost, duration: duration });

        await User.findByIdAndUpdate(user.id, { room: room._id });
        // await User.findOneAndUpdate({ type: "Caretaker" }, { room: room._id });
        
        await User.updateMany({ type: "Caretaker" }, { room: room._id });

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

exports.fetchRoom = async (req, res) => {
    try {
        const { roomId } = req.body;
        const user = req.user;

        if (user.type !== "Caretaker") {
            return res.status(401).json({
                success: false,
                message: "Restricted only for Caretaker"
            });
        }

        if (!roomId) {
            return res.status(401).json({
                success: false,
                message: "Please Fill All the Details"
            });
        }

        const response = await Room.findOne({ _id: roomId });
        const userDetails = await User.findOne({ _id: response.name });

        return res.status(200).json({
            success: true,
            message: "Room Fetched Successfully",
            data: {
                room: response,
                user: userDetails
            }
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


exports.joinRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const user = req.user;
        const userId = user.id;

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Add user to room if not already a member
        if (!room.members.includes(userId)) {
            room.members.push(userId);
            await room.save();
        }

        // Update user's room
        await User.findByIdAndUpdate(userId, { room: room._id });

        // res.json({ message: 'Joined room successfully', room });

        return res.status(200).json({
            success: true,
            message: "Joined room successfully",
            data: room
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

exports.getRoomMembers = async (req, res) => {
    try {
        const user1 = req.user;
        const userId = user1.id;

        const user = await User.findById(userId);

        if (!user.room) {
            return res.status(400).json({ message: 'User is not in any room' });
        }

        const room = await Room.findById(user.room).populate('members', 'username email currentLocation');
        return res.status(200).json({
            success: true,
            message: "Joined room successfully",
            data: room.members.filter(member => member._id.toString() !== userId)
        })
        // res.json(room.members.filter(member => member._id.toString() !== userId));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const {id} = req.body;
        const user = await User.findOne({_id: id});

        return res.status(200).json({
            success: true,
            message: "Joined room successfully",
            data: user
        })
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};