import React from "react";
import { Link } from "react-router-dom";

import accountIcon from "./account.svg";
import logoutIcon from "./logout.svg";

import styles from "./AccountBar.module.css";

interface AccountBarProps {
  isLogged: boolean;
  accountName?: string;
}

class AccountBar extends React.Component<AccountBarProps, any> {
  render() {
    return (
      <div className={styles.AccountBar}>
        <Link to={this.props.isLogged ? "/account" : "/login"}>
          <img
            className={styles.icon}
            src={accountIcon}
            alt="Konto"
            title="Konto"
            width={"40px"}
          />
          <span className={styles.accountName} title="Konto">
            {this.props.accountName ? this.props.accountName : "Zaloguj się"}
          </span>
        </Link>
        <Link to={this.props.isLogged ? "/logout" : "/login"}>
          <img
            className={styles.icon}
            src={logoutIcon}
            alt={this.props.isLogged ? "Wyloguj się" : "Zaloguj się"}
            title={this.props.isLogged ? "Wyloguj się" : "Zaloguj się"}
            width={"40px"}
          />
        </Link>
      </div>
    );
  }
}

export default AccountBar;
