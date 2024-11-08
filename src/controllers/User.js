const Users = require("../models/UserModel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const getUser = async (req, res) => {
  try {
    const response = await Users.find({}, 'username email role')

    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const registerUser = async (req, res) => {
  const { username, password, email, role } = req.body

  const findUser = await Users.findOne({ username })

  if (findUser) {
    return res.status(400).json({
      message: "Username telah digunakan!"
    })
  }

  const hashPassword = bcrypt.hashSync(password, 10)

  try {
    await Users.create({
      username: username,
      password: hashPassword,
      email: email,
      role: role,
      refreshToken: null
    })

    res.status(201).json({
      message: 'Pengguna telah didaftarkan!'
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body

    const findUser = await Users.findOne({ username })

    if (!findUser) {
      return res.status(400).json({
        message: "Pengguna tidak ditemukan!"
      })
    }

    const isPasswordValid = bcrypt.compareSync(password, findUser.password)

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Password salah!"
      })
    }

    const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN, {
      expiresIn: '1h'
    })

    const refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN, {
      expiresIn: '1d'
    })

    findUser.refreshToken = refreshToken
    await findUser.save()

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true
    })
    
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      secure: true
    })

    res.status(200).json({
      message: 'Berhasil login!',
      user: findUser.username,
      role: findUser.role
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const checkToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401)

    const findUser = await Users.findOne({ refreshToken: refreshToken })
    if (!findUser) return res.sendStatus(403)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decode) => {
      if (err) return res.sendStatus(403)

      const { username } = decode

      const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN, {
        expiresIn: '1h'
      })

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
        secure: true
      })

      res.status(200).json({
        user: findUser.username,
        role: findUser.role
      })
    })
  } catch (error) {
    console.log(error)
  }
}

const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) return res.sendStatus(204)

  const findUser = await Users.findOne({ refreshToken: refreshToken })
  if (!findUser) return res.sendStatus(204)

  findUser.refreshToken = null
  await findUser.save()

  res.clearCookie('refreshToken')
  res.clearCookie('accessToken')
  return res.status(200).json({
    message: 'Berhasil logout!'
  })
}

module.exports = {
  getUser,
  registerUser,
  login,
  checkToken,
  logout
}