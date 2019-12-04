import React from 'react';
import css from './Footer.css';

function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.logo}>S</div>
      <div>
        <a href="github.com">Contribute on Github</a>
      </div>
    </footer>
  );
}
export default Footer;
