import React from "react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

import styles from "./NotFound.module.css";

class NotFound extends React.Component<any, any> {
  render() {
    return (
      <div className={styles.container}>
        <span className={styles.code}>404</span>
        <div className={styles.text}>
          <span className={styles.errorMessage}>
            Nie znaleziono <span className={styles.unbreakable}>:(</span>
          </span>
          <span className={styles.tips}>
            <span className={styles.link} onClick={this.goBack}>
              Wróć
            </span>
            lub idź na
            <Link to="/" className={styles.link}>
              stronę główną
            </Link>
          </span>
        </div>
      </div>
    );
  }
  goBack() {
    window.history.back(); //or window.history.go(n) e.g. window.history.go(-2) will go back twice
  }
}

export default withRouter(NotFound);
