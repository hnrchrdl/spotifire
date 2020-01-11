/* eslint-disable react/prop-types */
import cx from "classnames";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import css from "./Toast.css";

function Toast({ message, show, type = "success" }) {
  return (
    <div
      className={cx(css.toast, {
        [css.show]: show,
        [css.error]: type === "error"
      })}
    >
      <div className={css.message}>{message}</div>
      <div className={cx(css.icon, { [css.iconError]: type === "error" })}>
        <FontAwesomeIcon icon={type === "error" ? faTimes : faCheck} />
      </div>
    </div>
  );
}

export default Toast;
