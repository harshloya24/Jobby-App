const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// ✅ ONLY THIS
const {getDB} = require('../db')

const loginUser = async (req, res) => {
  const {username, password} = req.body

  const db = getDB() // ✅ CORRECT

  const user = await db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username],
  )

  if (!user) {
    return res.status(400).json({error_msg: 'Invalid username'})
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password)

  if (!isPasswordMatched) {
    return res.status(400).json({error_msg: 'Invalid password'})
  }

  const payload = {
    username: user.username,
  }

  const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN')

  res.json({jwt_token: jwtToken})
}

module.exports = {loginUser}