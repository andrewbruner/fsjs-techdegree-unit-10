// Dependencies
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Data from './Data';

// Context
const Context = React.createContext(); 

// Provider
export class Provider extends Component {

  constructor() {
    super();
    this.data = new Data();
  }

  state = {
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
  };

  render() {
    
    // Value
    const value = {
      authenticatedUser: this.state.authenticatedUser,
      data: this.data,
      actions: {
        signUp: this.signUp,
        signIn: this.signIn,
        signOut: this.signOut,
        getCourses: this.getCourses,
        createCourse: this.createCourse,
        getCourseDetail: this.getCourseDetail,
        updateCourse: this.updateCourse,
        deleteCourse: this.deleteCourse,
      },
    };

    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>  
    );
  }

  // Sign Up / Create User
  signUp = async (user, confirmPassword) => {

    // Passwords Match
    if (user.password === confirmPassword) {

      // Fetch API
      const response = await this.data.api('/users', 'POST', user);

      // Response: Created
      if (response.status === 201) {
        return [];

      // Response: Bad Request
      } else if (response.status === 400) {
        const error = await response.json();
        return [error.message];

      // Other Response
      } else {
        throw new Error();
      }

    // Passwords Do Not Match
    } else {
      const error = { message: 'Passwords do not match' };
      return [error.message];
    }
  }

  // Sign In / Get User
  signIn = async (emailAddress, password) => {

    // Fetch API
    const response = await this.data.api(`/users`, 'GET', null, true, { emailAddress, password });

    // Response: OK
    if (response.status === 200) {
      const data = await response.json();
      const user = { firstName: data.firstName, lastName: data.lastName, emailAddress: data.emailAddress, password: password, };
      this.setState(() => ({ authenticatedUser: user }));
      Cookies.set('authenticatedUser', user, { expires: 1 });
      return [];

    // Response: Unauthorized
    } else if (response.status === 401) {
      const error = await response.json();
      return [error.message];

    // Other Response
    } else {
      throw new Error();
    }

  };

  // Sign Out
  signOut = () => {
    this.setState(() => ({ authenticatedUser: null }));
    Cookies.remove('authenticatedUser');
  }

  // Get Courses
  getCourses = () => {
    this.data.api('/courses', 'GET')
      .then(response => {

        // Response: OK
        if (response.status === 200) {
          return response.json()
            .then(courses => courses);

        // Other Response
        } else {
          throw new Error();
        }
      });
  }

  // Create Course
  createCourse = async (course, emailAddress, password) => {

    // Fetch API
    const response = await this.data.api('/courses', 'POST', course, true, { emailAddress, password });
    console.log('response status from api is: ' + response.status);
    // Response: Created
    if (response.status === 201) {
      console.log(response);
      return response.location;

    // Response: Bad Request
    } else if (response.status === 400) {
      const error = await response.json();
      return [error.message];

    // Response: Unauthorized
    } else if (response.status === 401) {
      const error = await response.json();
      return [error.message];

    // Other Response
    } else {
      throw new Error();
    }
  }
}

// export Consumer component
export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
};
