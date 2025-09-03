const usuariosRepository = require('../repositories/usuariosRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const error404Body = {
    status: 404,
    message: "Usuário não encontrado",
    errors: [
        {email: "Não existe usuário com esse email"}
    ]
}

const error404BodyId = {
    status: 404,
    message: "Usuário não encontrado",
    errors: [
        {id: "Não existe usuário com esse id"}
    ]
}

const error400Body = {
    status: 400,
    message: "Email inválido",
    errors: [
        {email: "Já existe usuário com esse email"}
    ]
}


async function login(req, res) {
    try{
        const {email, senha} = req.body;
        const resultado = await usuariosRepository.findEmail(email);
        if(resultado == null){
            return res.status(404).json(error404Body);
        }else if(resultado === false){
            return res.status(500).send();
        } else {
            const senhaValida = await bcrypt.compare(senha, resultado.senha);
            if(!senhaValida){
                return res.status(401).json({status: 401, message: "Senha inválida", errors: [{senha: "Senha incorreta"}]});
            }
            console.log(process.env.JWT_SECRET || "segredo");
            const token = jwt.sign({ id: resultado.id, email: resultado.email, nome: resultado.nome }, process.env.JWT_SECRET || "segredo", { expiresIn: '1d' });
            res.cookie("token", token, { 
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 1000 * 24,
                path: "/"
            });
            return res.status(200).json({
                status: 200,
                message: "Login realizado com sucesso",
                access_token: token
            });
        }
        
    }catch(err){
        console.log(err);
        return res.status(500).send();
    }
}


async function register(req, res) {
    try {
        const { email, senha, nome } = req.body;
        const usuarioExistente = await usuariosRepository.findEmail(email);
        if (usuarioExistente) {
            return res.status(400).json(error400Body);
        }
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);
        const novoUsuario = await usuariosRepository.create({
            email,
            senha: senhaHash,
            nome
        });
        
        return res.status(201).json({
            status: 201,
            message: "Usuário criado com sucesso",
            usuario: {
                id: novoUsuario.id,
                email: novoUsuario.email,
                nome: novoUsuario.nome
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send();
    }
}

async function logout(req, res) {
    try {
        res.clearCookie("token");
        return res.status(200).json({status: 200, message: "Logout realizado com sucesso" });
    } catch (err) {
        return res.status(500).send();
    }
}

async function removerUsuario(req, res) {
    try {
        const { id } = req.params;
        const usuarioRemovido = await usuariosRepository.remove(id);
        if (usuarioRemovido == 0) {
            return res.status(404).json(error404BodyId);
        }
        return res.status(204).send();
    } catch (err) {
        console.error(err);
        return res.status(500).send();
    }
}

module.exports = {
    login,
    register,
    logout,
    removerUsuario
};
