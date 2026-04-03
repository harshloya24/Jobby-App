const express = require('express')
const cors = require('cors')
const {connectDB} = require('./db')
const authRoutes = require('./routes/authRoutes')
const jobRoutes = require('./routes/jobRoutes')

const app = express()
app.use(express.json())
app.use(cors())

app.use('/', authRoutes)
app.use('/', jobRoutes)

let db = null

const startServer = async () => {
  db = await connectDB()

  const PORT = process.env.PORT || 5000

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()

module.exports = db
