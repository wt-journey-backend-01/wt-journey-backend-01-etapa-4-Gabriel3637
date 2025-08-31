const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            status: 401,
            message: "Token não fornecido",
            errors: [
                { token: "O token de autenticação é obrigatório" }
            ]
        });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).json({
                status: 401,
                message: "Token inválido",
                errors: [
                    { token: "O token de autenticação é inválido" }
                ]
            });
        }
        req.user = decoded;
        next();
    });
}

module.exports = {
    authMiddleware
};
