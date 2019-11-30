import React from 'react';
import propTypes from 'prop-types';
import css from './Index.css';

class Index extends React.PureComponent {
  render() {
    const { displayName } = this.props;
    return (
      <div className={css.container}>
        Hi
        {' '}
        {displayName}
        <button type="button">start</button>
        <button type="button">stop</button>
      </div>
    );
  }
}

Index.propTypes = {
  // req.user
  displayName: propTypes.string.isRequired,
};
export default Index;
