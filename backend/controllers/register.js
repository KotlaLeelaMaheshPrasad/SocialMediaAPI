const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const dotenv=require("dotenv");
dotenv.config();

const user = require('../models/user');



const addUserDetails = async (userDetails) => {
    await user.create(userDetails);
}

module.exports = async (request, response) => {
    const {username, name, email, password} = request.body;
    let result = await user.find({ $or: [{username: username}, {email: email} ] });
    console.log(result);
    //result = await result.toArray();
    if(result.length!==0){
        console.log(result);
        response.send("user already exists");
    }else{
        await bcrypt.hash(password, 10).then((hashedPassword) => {
            let userDetails = {
                _id: new mongoose.Types.ObjectId(),
                username: username,
                name: name,
                email: email,
                password: hashedPassword,
            }
            addUserDetails(userDetails);
            //console.log(hashedPassword);
            response.send("user registered successfully");
        });
    }
};