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
  try {
    db = await connectDB()

   app.listen(5000, () => {
  console.log('Server running at http://localhost:5000/')
})
  } catch (error) {
    console.log('DB Error:', error.message)
    process.exit(1)
  }
}

startServer()

module.exports = db