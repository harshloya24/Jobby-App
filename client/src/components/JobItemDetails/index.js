import {Component} from 'react'
import Cookies from 'js-cookie'
import {ThreeDots} from 'react-loader-spinner'
import {BsFillStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FiExternalLink} from 'react-icons/fi'
import {useParams} from 'react-router-dom'

import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobData: {},
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.id !== this.props.params.id) {
      this.getJobData()
    }
  }

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    skills: data.skills
      ? data.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        }))
      : [],
    lifeAtCompany: data.life_at_company
      ? {
          description: data.life_at_company.description,
          imageUrl: data.life_at_company.image_url,
        }
      : {description: '', imageUrl: ''},
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  getJobData = async () => {
    const {id} = this.props.params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://jobby-backend-kwgu.onrender.com/jobs/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()

      const updatedData = this.getFormattedData(fetchedData.job || {})

      this.setState({
        jobData: updatedData,
        similarJobsData: [],
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="job-details-loader-container" data-testid="loader">
      <ThreeDots height="50" width="50" color="#ffffff" />
    </div>
  )

  renderFailureView = () => (
    <div className="job-details-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-view-image"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="job-details-retry-button"
        onClick={this.getJobData}
      >
        Retry
      </button>
    </div>
  )

  renderJobDetailsView = () => {
    const {jobData} = this.state

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobData

    return (
      <div className="job-details-view-container">
        <div className="job-item">
          <div className="company-logo-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="title-rating-container">
              <h1 className="title-heading">{title}</h1>
              <div className="rating-container">
                <BsFillStarFill className="star-icon" />
                <p className="rating-text">{rating}</p>
              </div>
            </div>
          </div>

          <div className="location-package-container">
            <div className="location-type-container">
              <div className="location-container">
                <MdLocationOn className="location-icon" />
                <p className="location-text">{location}</p>
              </div>
              <div className="employment-type-container">
                <BsFillBriefcaseFill className="briefcase-icon" />
                <p className="employment-type-text">{employmentType}</p>
              </div>
            </div>
            <p className="package-text">{packagePerAnnum}</p>
          </div>

          <hr className="job-card-separator" />

          <div className="description-visit-container">
            <h1 className="description-heading">Description</h1>
            {companyWebsiteUrl && (
              <a
                href={companyWebsiteUrl}
                className="visit-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit <FiExternalLink />
              </a>
            )}
          </div>

          <p className="job-description-text">{jobDescription}</p>

          {skills.length > 0 && (
            <>
              <h1 className="skills-heading">Skills</h1>
              <ul className="skills-list">
                {skills.map(eachSkill => (
                  <li className="skill-item" key={eachSkill.name}>
                    <img
                      src={eachSkill.imageUrl}
                      alt={eachSkill.name}
                      className="skill-image"
                    />
                    <p className="skill-name">{eachSkill.name}</p>
                  </li>
                ))}
              </ul>
            </>
          )}

          {lifeAtCompany.description && (
            <>
              <h1 className="life-at-company-heading">Life at Company</h1>
              <div className="life-at-company-container">
                <p className="life-at-company-description">
                  {lifeAtCompany.description}
                </p>
                <img
                  src={lifeAtCompany.imageUrl}
                  alt="life at company"
                  className="life-at-company-image"
                />
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.renderJobDetails()}
        </div>
      </>
    )
  }
}

// ✅ Wrapper for React Router v6
const JobItemDetailsWrapper = props => {
  const params = useParams()
  return <JobItemDetails {...props} params={params} />
}

export default JobItemDetailsWrapper
