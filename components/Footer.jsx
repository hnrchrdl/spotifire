import React from "react";
import css from "./Footer.css";

function Footer() {
  return (
    <footer className={css.footer}>
      <img src="/static/logo_text_40.png" alt="logo" />
      <br />
      <br />
      <a href="https://github.com/hnrchrdl/spotifire">Contribute on Github</a>
    </footer>
  );
}
export default Footer;
