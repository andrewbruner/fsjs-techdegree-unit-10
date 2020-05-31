import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import config from '../utils/config';

export default class CourseDetail extends Component {

  // Local State
  state = {
    courseDetail: [],
    errors: [],
  }

  // Get Course Detail
  getCourseDetail = (id) => {

    // context
    const { context } = this.props;
    
    // course id
    const { id } = this.props.match.params.id;

    context.actions.getCourseDetail(id)

      .then(courseDetail => {
        this.setState(() => ({ courseDetail: courseDetail }));
      })

      .catch(err => {
        console.log(err);
        this.props.history.push('/error');
      });
  }

  // Delete Course
  deleteCourse = () => {
    
  }

  // Component Did Mount
  componentDidMount() {
    this.readCourseDetail();
  }

  render() {
    return (
      <div>
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
              <span>
                <Link className="button" to={`/courses/${this.state.courseDetail.id}/update`}>Update Course</Link>
                <Link className="button" to="/" onClick={() => this.deleteCourse()}>Delete Course</Link>
              </span>
              <Link className="button button-secondary" to="/">Return to List</Link>
            </div>
          </div>
        </div>
        <div className="bounds course--detail">
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{this.state.courseDetail.title}</h3>
              <p>{this.state.courseDetail.user?.firstName} {this.state.courseDetail.user?.lastName}</p>
            </div>
            <div className="course--description">
              <p>{this.state.courseDetail.description}</p>
            </div>
          </div>
          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                <li className="course--stats--list--item">
                  <h4>Estimated Time</h4>
                  <h3>{this.state.courseDetail.estimatedTime}</h3>
                </li>
                <li className="course--stats--list--item">
                  <h4>Materials Needed</h4>
                  <ul>
                    <li>{this.state.courseDetail.materialsNeeded}</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

