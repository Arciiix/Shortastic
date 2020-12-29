import React from "react";
import { withRouter } from "react-router-dom";

import styles from "./Home.module.css";

import AccountBar from "../AccountBar/AccountBar";

interface HomeState {
  url: string;
  shortcut: string;
  errors: { url: boolean; shortcut: boolean; isAvailable: boolean };
}

class Home extends React.Component<any, HomeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      errors: { url: false, shortcut: false, isAvailable: true },
      url: "",
      shortcut: "",
    };
  }

  async createShortenedURL(): Promise<void> {
    let emptyErrors = {
      url: this.state.url === "",
      shortcut: this.state.shortcut === "",
      isAvailable: true,
    };
    if (emptyErrors.url || emptyErrors.shortcut) {
      return this.setState({ errors: emptyErrors });
    }

    let request = await fetch(
      `http://localhost:5434/api/createShortenedLink/`, //DEV: should be /api/createShortenedLink
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          short: this.state.shortcut,
          full: this.state.url,
        }),
      }
    );

    let response = await request.json();

    if (!response.ok) {
      console.error(`Error: ${response.error}`);
      let errors = { url: false, shortcut: false, isAvailable: true };

      switch (response.error) {
        case "fullUrlIsntValid":
          errors.url = true;
          break;
        case "shortcutIsntValid":
          errors.shortcut = true;
          break;
        case "alreadyExist":
          errors.shortcut = true;
          errors.isAvailable = false;
          break;
      }

      this.setState({ errors: errors });
    } else {
      this.setState({
        errors: { url: false, shortcut: false, isAvailable: true },
      });
      //Redirect to the summary page
      this.props.history.push(`/summary?id=${this.state.shortcut}`);
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <AccountBar isLogged={false} />
        <div className={styles.urlDiv}>
          <input
            type="text"
            className={[
              styles.urlInput,
              this.state.errors.url && styles.errorInput,
            ].join(" ")} //If there's an error, add the error class
            placeholder="Link do skrócenia"
            id="urlInput"
            name="urlInput"
            value={this.state.url}
            onChange={(e) => this.setState({ url: e.target.value })}
            required
          />
          <label
            htmlFor="urlInput"
            className={[
              styles.inputLabel,
              this.state.errors.url && styles.errorLabel,
            ].join(" ")} //If there's an error, add the error class
          >
            Link do skrócenia
          </label>
        </div>
        <div className={styles.urlDiv}>
          <input
            type="text"
            className={[
              styles.urlInput,
              this.state.errors.shortcut && styles.errorInput,
            ].join(" ")} //If there's an error (or shortcut isn't available), add the error class
            placeholder="Link do skrócenia"
            id="shortcutInput"
            name="shortcutInput"
            value={this.state.shortcut}
            onChange={(e) => this.setState({ shortcut: e.target.value })}
            required
          />
          <label
            htmlFor="shortcutInput"
            className={[
              styles.inputLabel,
              this.state.errors.shortcut && styles.errorLabel,
            ].join(" ")} //If the shortcut isn't available, add the error class
          >
            Skrót <b>{!this.state.errors.isAvailable && "(ZAJĘTY)"}</b>
          </label>
        </div>
        <div className={styles.button}>
          <button
            className={styles.submit}
            onClick={this.createShortenedURL.bind(this)}
          >
            Wygeneruj
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
