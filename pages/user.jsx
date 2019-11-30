import React from 'react';
import User from '../components/User';

class UserPage extends React.PureComponent {
    static getInitialProps = ({ req }) => ({
      ...req.user,
    })

    render() {
      const { props } = this;
      return <User {...props} />;
    }
}

export default UserPage;
