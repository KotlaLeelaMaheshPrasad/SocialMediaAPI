const jwt = require('jsonwebtoken');
const dotenv=require("dotenv");
dotenv.config();

module.exports = (request, response, next) => {
    //console.log(request.headers.authorization);
    const jwtToken = request.headers.authorization.split(" ")[1];
    //console.log(jwtToken);
    if(!jwtToken)
    response.send("user doesnot logged in")
    const {username} = jwt.verify(jwtToken, process.env.JWT_SECRET_TOKEN);
    request.username = username;
    next();
};