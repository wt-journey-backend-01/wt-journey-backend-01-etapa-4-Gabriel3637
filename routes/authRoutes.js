const express = require('express')
const routerUsuario = express.Router();
const authController = require('../controllers/authController');
const {authMiddleware} = require('../middlewares/authMiddleware.js');
const validates = require('../utils/validateFunctions');
const { router } = require('../docs/swagger.js');

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthRequestLoginBody:
 *       type: object
 *       required:
 *         - email
 *         - senha
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         senha:
 *           type: string
 *     AuthRequestRegisterBody:
 *       type: object
 *       required:
 *         - email
 *         - senha
 *         - nome
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         senha:
 *           type: string
 *           format: password
 *         nome:
 *           type: string
 *           format: name
 *     AuthLoginResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: Login realizado com sucesso
 *         access_token:
 *           type: string
 *     AuthRegisterResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 201
 *         message:
 *           type: string
 *           example: Usuário criado com sucesso
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             email:
 *               type: string
 *               format: email
 *             nome:
 *               type: string
 *     AuthError:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 401
 *         message:
 *           type: string
 *           example: Token não fornecido
 *         errors:
 *           type: array
 *           example:
 *             - token: O token de autenticação é obrigatório
 *     AuthEmailError:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 400
 *         message:
 *           type: string
 *           example: Email inválido
 *         errors:
 *           type: array
 *           example:
 *             - email: Já existe um usuário com esse email
 *     AuthParametrosError:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 400
 *         message:
 *           type: string
 *           example: Parâmetros inválidos
 *         errors:
 *           type: array
 *           example:
 *             - nome: A requisição deve possuir o campo 'nome'
 *             - email: A requisição deve possuir o campo 'email'
 *             - senha: A requisição deve possuir o campo 'senha'
 *     AuthUsuarioInexistenteEmailError:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 404
 *         message:
 *           type: string
 *           example: Usuário não encontrado
 *         errors:
 *           type: array
 *           example:
 *             - email: Não existe usuário com esse email
 *     AuthUsuarioInexistenteIdError:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 404
 *         message:
 *           type: string
 *           example: Usuário não encontrado
 *         errors:
 *           type: array
 *           example:
 *             - id: Não existe usuário com esse id
 */

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Sair
 *     description: Realiza o logout do usuário
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Token não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 */

routerUsuario.post('/logout', authMiddleware, authController.logout);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registrar
 *     description: Cria um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequestRegisterBody'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthRegisterResponse'
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthEmailError'
 */

routerUsuario.post('/register', validates.validateUsuarioCadastroBody, authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login
 *     description: Realiza o login do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequestLoginBody'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthLoginResponse'
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthEmailError'
 *       401:
 *         description: Token não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 */

routerUsuario.post('/login', validates.validateUsuarioLoginBody, authController.login);

/**
 * @openapi
 * /auth/remove/{id}:
 *   delete:
 *     summary: Remover usuário
 *     description: Remove um usuário existente
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser removido
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Usuário removido com sucesso
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthUsuarioInexistenteIdError'
 */

module.exports = routerUsuario;