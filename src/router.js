const { ping, insertData, getData } = require('./controllers/Form')
const { getUser, registerUser, login, checkToken, logout } = require('./controllers/User')
const verifyToken = require('./middlewares/verifyToken')

const router = require('express').Router()

router.get('/user', verifyToken, getUser)
router.post('/register', registerUser)
router.post('/login', login)
router.get('/login', checkToken)
router.get('/logout', logout)

router.get('/test', ping)
router.get('/form', verifyToken, getData)
router.post('/form', insertData)

module.exports = router