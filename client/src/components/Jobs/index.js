import {Component} from 'react'
import Cookies from 'js-cookie'
import {ThreeDots} from 'react-loader-spinner' 
import JobCard from '../JobCard'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    profileData: {},
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
    searchInput: '',
    activeEmploymentType: [],
    activeSalaryRanges: [],
  }

  componentDidMount() {

    this.getJobs()
  }

  getProfile = async () => {}

  getJobs = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})

    const {searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://jobby-backend-kwgu.onrender.com/jobs?search=${searchInput}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()

      const updatedData = fetchedData.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))

      this.setState({
        jobsList: updatedData,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  onChangeEmploymentType = event => {
    const {activeEmploymentType} = this.state
    const {value, checked} = event.target

    if (checked) {
      this.setState(
        {activeEmploymentType: [...activeEmploymentType, value]},
        this.getJobs,
      )
    } else {
      const updatedList = activeEmploymentType.filter(each => each !== value)
      this.setState({activeEmploymentType: updatedList}, this.getJobs)
    }
  }

  onChangeSalaryRange = event => {
    const {activeSalaryRanges} = this.state
    const {value, checked} = event.target

    if (checked) {
      this.setState(
        {activeSalaryRanges: [...activeSalaryRanges, value]},
        this.getJobs,
      )
    } else {
      const updatedList = activeSalaryRanges.filter(each => each !== value)
      this.setState({activeSalaryRanges: updatedList}, this.getJobs)
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.getJobs()
  }

  renderProfileSection = () => null

  renderJobsList = () => {
    const {jobsList, jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return jobsList.length > 0 ? (
          <ul className="jobs-list">
            {jobsList.map(job => (
              <JobCard key={job.id} jobData={job} />
            ))}
          </ul>
        ) : (
          <h1>No Jobs Found</h1>
        )

      case apiStatusConstants.failure:
        return (
          <div>
            <h1>Something went wrong</h1>
            <button onClick={this.getJobs}>Retry</button>
          </div>
        )

      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container">
            {/* ✅ FIXED HERE */}
            <ThreeDots height="50" width="50" color="#ffffff" />
          </div>
        )

      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    const employmentTypesList = [
      {label: 'Full Time', employmentTypeId: 'FULLTIME'},
      {label: 'Part Time', employmentTypeId: 'PARTTIME'},
      {label: 'Freelance', employmentTypeId: 'FREELANCE'},
      {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
    ]

    const salaryRangesList = [
      {salaryRangeId: '1000000', label: '10 LPA and above'},
      {salaryRangeId: '2000000', label: '20 LPA and above'},
      {salaryRangeId: '3000000', label: '30 LPA and above'},
      {salaryRangeId: '4000000', label: '40 LPA and above'},
    ]

    return (
      <>
        <Header />

        <div className="jobs-container">
          <div className="filters-section">
            <h1>Type of Employment</h1>
            <ul>
              {employmentTypesList.map(each => (
                <li key={each.employmentTypeId}>
                  <input
                    type="checkbox"
                    value={each.employmentTypeId}
                    onChange={this.onChangeEmploymentType}
                  />
                  <label>{each.label}</label>
                </li>
              ))}
            </ul>

            <h1>Salary Range</h1>
            <ul>
              {salaryRangesList.map(each => (
                <li key={each.salaryRangeId}>
                  <input
                    type="checkbox"
                    value={each.salaryRangeId}
                    onChange={this.onChangeSalaryRange}
                  />
                  <label>{each.label}</label>
                </li>
              ))}
            </ul>
          </div>

          <div className="jobs-section">
            <div className="search-container">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                className="search-button"
                onClick={this.onClickSearch}
              >
                <img
                  src="https://assets.ccbp.in/frontend/react-js/search-icon.png"
                  alt="search"
                  className="search-icon"
                />
              </button>
            </div>
            {this.renderJobsList()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
