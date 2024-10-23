const db = require('../db/db');

async function LoginUser ( req, res ) {
    const {email, password} = req.body;
    console.log(email, password);

    const userExists = await db.User.findOne({email: email, password: password});
    
    console.log(userExists.name, userExists.email, userExists.password);
    if(userExists) {
        return res.status(200).send(userExists);
    } else {
        return res.status(400).send('credenciais inválidas, tente novamente');
    }
}


module.exports = {LoginUser}