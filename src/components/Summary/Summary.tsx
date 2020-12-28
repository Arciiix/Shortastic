import { withRouter } from "react-router-dom";
import React from "react";

import styles from "./Summary.module.css";

interface SummaryState {
  shortenedLink: string;
  isLogged: boolean;
  accountName?: string;
}

class Summary extends React.Component<any, SummaryState> {
  constructor(props: any) {
    super(props);
    this.state = {
      shortenedLink: "",
      isLogged: true, //TODO DEV
      accountName: "", //TODO DEV
    };
  }

  componentDidMount() {
    //Get the shortened url
    let params = this.parseTheParams();
    let shortenedLink = params.filter((elem: any) => elem.key === "id")[0];

    if (!shortenedLink) {
      this.setState({
        shortenedLink: `Error, see console`,
      });
      return console.error(
        `ERROR: There isn't shortened link in the query (the id parameter).`
      );
    } else {
      //It's the id only, so we have to add the host URL before (so hostname + / + id) (e.g. http://localhost:3000/test)
      shortenedLink.value = window.location.origin + "/" + shortenedLink.value;
      this.setState({ shortenedLink: shortenedLink.value });
    }
  }

  parseTheParams(): any {
    let query: string = this.props.location.search;
    query = query.substring(1);
    let params: Array<string> = query.split("&");
    let paramsArray = params.map((elem: string) => {
      return { key: elem.split("=")[0], value: elem.split("=")[1] };
    });
    return paramsArray;
  }

  copyToClipboard(text: string): void {
    let textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 9999999); //For mobile devices
    document.execCommand("Copy");
    textArea.remove();
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.summary}>
          <span className={styles.generatedLink}>
            <a
              className={styles.generatedLinkLink}
              href={this.state.shortenedLink}
            >
              {this.state.shortenedLink}
            </a>
          </span>
          <div className={styles.buttonDiv}>
            <button
              className={styles.button}
              onClick={(e) => {
                this.copyToClipboard(this.state.shortenedLink);
                let btn: HTMLElement = e.target as HTMLElement;
                btn.innerHTML = "Skopiowano";
              }}
            >
              Kopiuj
            </button>
          </div>
          {this.state.isLogged && (
            <div className={styles.accountSection}>
              <div className={styles.buttonDiv}>
                <button className={styles.button}>
                  Panel użytkownika (DEV)
                </button>
              </div>
              <span className={styles.loggedAs}>Zalogowano jako</span>
              <span className={styles.login}>Lorem ipsum dolor sit amet</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Summary);
