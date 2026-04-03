const express = require('express')
const router = express.Router()

const {getJobs,getJobDetails} = require('../controllers/jobController')

router.get('/jobs', getJobs)
router.get('/jobs/:id', getJobDetails)

module.exports = router