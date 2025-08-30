const usuariosRepository = require('../controllers/usuariosRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const apiError = require('../utils/errorHandler.js');

const error404Body = {
    status: 404,
    message: "Usuário não encontrado",
    errors: [
        {email: "Não existe usuário com esse email"}
    ]
}
const error400Body = {
    status: 400,
    message: "Email inválido",
    errors: [
        {email: "Já existe usuário com esse email"}
    ]
}



//Login


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
            const token = jwt.sign({ id: resultado.id, email: resultado.email, nome: resultado.nome }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ 
                message: "Login realizado com sucesso",
                token
            });
        }
        
    }catch(err){
        res.status(500).send();
    }
}


async function register(req, res) {
    try {
        const { email, senha, nome } = req.body;
        const usuarioExistente = await usuariosRepository.findEmail(email);
        if (usuarioExistente) {
            return res.status(400).json(error400Body);
        }
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
        const senhaHash = await bcrypt.hash(senha, salt);
        const novoUsuario = await usuariosRepository.create({
            email,
            senha: senhaHash,
            nome
        });
        
        return res.status(201).json({
            message: "Usuário criado com sucesso",
            usuario: {
                id: novoUsuario.id,
                email: novoUsuario.email,
                nome: novoUsuario.nome
            }
        });
    } catch (err) {
        res.status(500).send();
    }
}

