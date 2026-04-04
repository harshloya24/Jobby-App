const { getDB } = require('../db')

const getJobs = async (req, res) => {
  try {
    const db = getDB()

    const {
      search = '',
      employment_type = '',
      min_package = '',
    } = req.query

    let query = `
      SELECT * FROM jobs
      WHERE title LIKE ?
    `

    const params = [`%${search}%`]

    
    const employmentTypeMap = {
      FULLTIME: 'Full Time',
      PARTTIME: 'Part Time',
      FREELANCE: 'Freelance',
      INTERNSHIP: 'Internship',
    }

    if (employment_type) {
      query += ` AND employment_type = ?`
      params.push(employmentTypeMap[employment_type])
    }

    
    if (min_package) {
      query += `
        AND CAST(REPLACE(package_per_annum, ' LPA', '') AS INTEGER) >= ?
      `
      params.push(parseInt(min_package) / 100000)
    }

    const jobs = await db.all(query, params)

    res.send({ jobs })
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
}

const getJobDetails = async (req, res) => {
  try {
    const db = getDB()
    const { id } = req.params

    const job = await db.get(
      `SELECT * FROM jobs WHERE id = ?`,
      [id]
    )

    res.send({ job })
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
}

module.exports = { getJobs, getJobDetails }
