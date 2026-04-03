import {Link} from 'react-router-dom'
import {BsFillStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const JobCard = props => {
  const {jobData = {}} = props

  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobData

  return (
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="job-item">
        <div className="company-logo-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
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

        <h1 className="description-heading">Description</h1>
        <p className="job-description-text">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobCard