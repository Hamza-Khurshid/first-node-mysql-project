var bcrypt = require('bcryptjs');
var db= require('../config/db');
const jwt = require("jsonwebtoken");

// Register a new User
exports.register = async (req, res) => {

    if(!req.body.mobile || !req.body.name || !req.body.email, !req.body.password || !req.body.status) {
        res.status(422).send({
            data: null,
            status: false,
            message: "Invalid parameters provided."
        });
    } else {

        db.query(`SELECT * FROM users WHERE email = '${req.body.email}'`, async function(err, data, fields) {
            if(err) {
                res.status(500).send({
                    data: null,
                    status: false,
                    message: "Error retrieving User"
                });
            } else {
                let user = data[0];
                if (user) {
                    res.status(409).send({
                        data: null,
                        status: false,
                        message: "User already registered."
                    });
                } else {
                    //Hash password
                    const salt = await bcrypt.genSalt(10);
                    const hasPassword = await bcrypt.hash(req.body.password, salt);
    
                    let sql = `INSERT INTO users (mobile, email, name, password, status) VALUES ('${req.body.mobile}','${req.body.email}','${req.body.name}','${hasPassword}','${req.body.status}')`;
                    db.query(sql, (err, data) => {
                        if(err) {
                            console.log('Error: ', err)
                            res.status(500).send({
                                data: null,
                                status: false,
                                message: "Error creating User"
                            });
                        } else {
                            // Create an user object
                            const user = {
                                id: data.insertId,
                                mobile: req.body.mobile,
                                email: req.body.email,
                                name: req.body.name,
                                status: req.body.status || false
                            };
    
                            res.status(200).send({
                                data: user,
                                status: true,
                                message: 'User registered successfully.'
                            });
    
                        }
                    }) 
                }
            }
        })  

    }
};

// Login
exports.login = async (req, res) => {
    try {
        db.query(`SELECT * FROM users WHERE email = '${req.body.email}'`, async function(err, data, fields) {
            if(err) {
                res.status(500).send({
                    data: null,
                    status: false,
                    message: "Error retrieving user."
                });
            } else {
                let user = data[0];
                if (user) {
                    const validPass = await bcrypt.compare(req.body.password, user.password);
                    if (!validPass) return res.status(400).send({
                        data: null,
                        status: false,
                        message: "Incorrect Email or Password."
                    });

                    delete user.password;
                    const token = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET);
                    res.status(200).send({
                        token,
                        data: user, 
                        status: true,
                        message: "Logged in successfully."
                    });
                } else {
                    res.status(401).send({
                        data: null,
                        status: false,
                        message: "No User Found."
                    });
                }
            }
        });
    } catch (err) {
        if(err) {
            res.status(401).send({
                data: null,
                status: false,
                message: `Email or Password is wrong`
            });
        } else {
            res.status(500).send({
                data: null,
                status: false,
                message: "Error retrieving User"
            });
        }
    }   
    
};

// Reset User password
exports.resetPassword = async (req, res) => {

    if(!req.body.email, !req.body.password) {
        res.status(422).send({
            data: null,
            status: false,
            message: "Invalid parameters provided."
        });
    } else {

        db.query(`SELECT * FROM users WHERE email = '${req.body.email}'`, async function(err, data, fields) {
            if(err) {
                res.status(500).send({
                    data: null,
                    status: false,
                    message: "Error retrieving User"
                });
            } else {
                let user = data[0];
                if (user) {
                    //Hash password
                    const salt = await bcrypt.genSalt(10);
                    const hashPassword = await bcrypt.hash(req.body.password, salt);
    
                    let sql = `UPDATE users SET password='${hashPassword}' WHERE email = '${req.body.email}'`;
                    db.query(sql, (err, data) => {
                        if(err) {
                            res.status(500).send({
                                data: null,
                                status: false,
                                message: "Error updating User"
                            });
                        } else {
                            delete user.password;
    
                            res.status(200).send({
                                data: user,
                                status: true,
                                message: 'User updated successfully.'
                            });
    
                        }
                    })
                    
                } else {
                    res.status(409).send({
                        data: null,
                        status: false,
                        message: "No user found."
                    });
                }
            }
        })  

    }
};