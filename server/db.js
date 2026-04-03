const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const path = require('path')
const bcrypt = require('bcrypt')

const dbPath = path.join(process.cwd(), 'jobbyApp.db')

let db = null

const connectDB = async () => {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  })

  // ✅ USERS TABLE
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    );
  `)

  // ✅ JOBS TABLE
  await db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      rating REAL,
      company_logo_url TEXT,
      location TEXT,
      employment_type TEXT,
      package_per_annum TEXT,
      job_description TEXT
    );
  `)

  // ✅ INSERT USERS
  const hashedPassword = await bcrypt.hash('rahul@2021', 10)

  await db.run(
    `INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`,
    ['rahul', hashedPassword]
  )

  // ✅ INSERT JOBS
  await db.run(`
    INSERT OR IGNORE INTO jobs (
      id,
      title,
      rating,
      company_logo_url,
      location,
      employment_type,
      package_per_annum,
      job_description
    ) VALUES
    (1, 'Frontend Developer', 4.2, 'https://assets.ccbp.in/frontend/react-js/jobby-app/netflix-img.png', 'Bangalore', 'Full Time', '10 LPA', 'Build UI applications'),
    (2, 'Backend Developer', 4.0, 'https://assets.ccbp.in/frontend/react-js/jobby-app/google-img.png', 'Hyderabad', 'Part Time', '8 LPA', 'Build APIs'),
    (3, 'Full Stack Developer', 4.5, 'https://assets.ccbp.in/frontend/react-js/jobby-app/facebook-img.png', 'Chennai', 'Internship', '6 LPA', 'Work on full stack');
  `)

  return db
}

// ✅ THIS WAS MISSING
const getDB = () => db

module.exports = {connectDB, getDB}
