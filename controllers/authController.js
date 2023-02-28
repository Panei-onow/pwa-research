const User = require("../models/userModel");

const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res) => {
    const {username, password} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            username,
            password: hashedPassword
        });
        //req.sessions.user = newUser;
        res.status(201).json({
            status: 'success',
            data : {
                user: newUser,
            }
        })
    }
    catch (e){
        res.status(400).json({
            status: 'fail',
        })
    }
}

exports.login = async (req, res) => {
    const {username, password} = req.body;
    let loadUser;
    try{
        const user = await User.findOne({ username });
        if (!user){
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            })
        }
        loadUser = user;
        const isCorrect = await bcrypt.compare(password, user.password);

        if (isCorrect){
            //req.sessions.user = user;
            const token = jwt.sign(
                { 
                  name: loadUser.name, userId:loadUser._id.toString()
                },
                'secret', { expiresIn: '1h' });
                res.status(200).json({ status: 'success', token: token, userId: loadUser._id.toString() });
        } 
        else {
            res.status(400).json({
                status: 'fail',
                message: 'Incorrect password'
            })
        }
    }
    catch (e){
        res.status(400).json({
            status: 'fail',
        })
    }
}