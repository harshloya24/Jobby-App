const {getDB} = require('../db')

const getJobs = async (req, res) => {
  const db = getDB()

  const {search = '', employment_type = '', min_package = ''} = req.query

  let query = `
    SELECT * FROM jobs
    WHERE title LIKE ?
  `

  const params = [`%${search}%`]

  if (employment_type) {
    query += ` AND employment_type = ?`
    params.push(employment_type)
  }

  if (min_package) {
    query += `
      AND CAST(REPLACE(package_per_annum, ' LPA', '') AS INTEGER) >= ?
    `
    params.push(min_package)
  }

  const jobs = await db.all(query, params)

  res.send({jobs})
}

const getJobDetails = async (req, res) => {
  const db = getDB()
  const {id} = req.params

  const job = await db.get(
    `SELECT * FROM jobs WHERE id = ?`,
    [id]
  )

  res.send({job})
}

module.exports = {getJobs, getJobDetails}