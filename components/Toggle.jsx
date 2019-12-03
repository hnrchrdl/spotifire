import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff } from '@fortawesome/free-solid-svg-icons';
import css from './Toggle.css';

function Toggle() {
  return (
    <button type="button" className={css.toggle}>
      <span className={css.check}><FontAwesomeIcon icon={faToggleOff} /></span>
    </button>
  );
}
export default Toggle;
