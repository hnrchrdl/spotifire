/* eslint-disable react/prop-types */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import cx from 'classnames';
import css from './Toggle.css';

function Toggle({ onClick, enabled }) {
  return (
    <button type="button" className={cx(css.toggle, { [css.enabled]: enabled })} onClick={onClick}>
      <FontAwesomeIcon icon={enabled ? faToggleOn : faToggleOff} />
    </button>
  );
}
export default Toggle;
