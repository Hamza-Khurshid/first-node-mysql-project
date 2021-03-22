var sql = require('mysql');

const create = async (newUser) => {
    let insert = await sql.query("INSERT INTO user SET ?", newUser);
    if( insert.insertId ) {
        return insert.insertId;
    }
    else {
        return;
    }
};

const login = async (value) => {
    let row = await sql.query(`SELECT * FROM user WHERE mobile = ? OR email = ?`, [value, value]);
    if( row.length ) {
        return row[0];
    }
    else {
        return "User does not exist"
        throw new Error("User does not exist");
    }
};

module.exports = {
    create,
    login
};