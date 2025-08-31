const db = require('../db/db');

async function read() {
    try{
        let resp = await db('usuarios').select('*');
        return resp;
    } catch(err) {
        console.log(err);
        return false;
    }
}

async function findId(id) {
    try {
        let resp = await db('usuarios').where({ id: id });
        let isSingular = Array.isArray(resp) && resp.length === 1;
        return isSingular ? resp[0] : null;
    } catch(err) {
        console.log(err);
        return false;
    }
}

async function findEmail(email) {
    try {
        let resp = await db('usuarios').where({ email: email });
        let isSingular = Array.isArray(resp) && resp.length === 1;
        return isSingular ? resp[0] : null;
    } catch(err) {
        console.log(err);
        return false;
    }
}

async function create(usuario) {
    try{
        let resp = await db('usuarios').insert(usuario, ["*"]);
        return resp[0];
    }catch(err){
        console.log(err);
        if(err.code === '23505'){
            return {code: err.code};
        }
        return false;
    }
}

async function update(id, usuario) {
    try {
        let resp = await db('usuarios').where({ id }).update(usuario, ["*"]);
        if(resp.length == 0){
            return null;
        } else {
            return resp[0];
        }
    }catch(err){
        console.log(err);
        if(err.code === '23505'){
            return {code: err.code};
        }
        return false;
    }
}

async function remove(id) {
    try {
        let resp = await db('usuarios').where({ id }).del();
        return resp;
    }catch(err){
        console.log(err);
        return false;
    }
}

module.exports = {
    read,
    create,
    update,
    remove,
    findEmail,
    findId
};
