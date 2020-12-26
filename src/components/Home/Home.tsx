import React from "react";

import styles from "./Home.module.css";

interface HomeState {
  isAvailable: boolean;
}

class Home extends React.Component<any, HomeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isAvailable: true,
    };
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.urlDiv}>
          <input
            type="text"
            className={[
              styles.urlInput,
              !this.state.isAvailable && styles.errorInput,
            ].join(" ")} //If the shortcut isn't available, add the error class
            placeholder="Link do skrócenia"
            id="urlInput"
            name="urlInput"
            required
          />
          <label
            htmlFor="urlInput"
            className={[
              styles.inputLabel,
              !this.state.isAvailable && styles.errorLabel,
            ].join(" ")} //If the shortcut isn't available, add the error class
          >
            Link do skrócenia <b>{!this.state.isAvailable && "(ZAJĘTY)"}</b>
          </label>
        </div>
        <div className={styles.urlDiv}>
          <input
            type="text"
            className={styles.urlInput}
            placeholder="Link do skrócenia"
            id="shortcutInput"
            name="shortcutInput"
            required
          />
          <label htmlFor="shortcutInput" className={styles.inputLabel}>
            Skrót
          </label>
        </div>
        <div className={styles.button}>
          <button className={styles.submit}>Wygeneruj</button>
        </div>
      </div>
    );
  }
}

export default Home;
