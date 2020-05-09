import "regenerator-runtime/runtime";
import React, { Component } from "react";
import logo from "./assets/logo.svg";
import nearlogo from "./assets/gray_near_logo.svg";
import near from "./assets/near.svg";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      speech: null,
      count1: null,
      count2: null,
    };
    this.signedInFlow = this.signedInFlow.bind(this);
    this.requestSignIn = this.requestSignIn.bind(this);
    this.requestSignOut = this.requestSignOut.bind(this);
    this.signedOutFlow = this.signedOutFlow.bind(this);
    this.changeGreeting = this.changeGreeting.bind(this);
    this.pollButtonClicked = this.pollButtonClicked.bind(this);
    this.resetButtonClicked = this.resetButtonClicked.bind(this);
  }

  componentDidMount() {
    let loggedIn = this.props.wallet.isSignedIn();
    if (loggedIn) {
      this.signedInFlow();
    } else {
      this.signedOutFlow();
    }
  }

  async signedInFlow() {
    console.log("come in sign in flow");
    this.setState({
      login: true,
    });
    const accountId = await this.props.wallet.getAccountId();
    if (window.location.search.includes("account_id")) {
      window.location.replace(
        window.location.origin + window.location.pathname
      );
    }
    await this.welcome();
    // await this.props.contract.increment_vote({ candidate: 1 });
  }

  async welcome() {
    console.log("account id: ", accountId);
    const response = await this.props.contract.welcome({
      account_id: accountId,
    });
    this.setState({ speech: response.text });
  }

  async requestSignIn() {
    const appTitle = "NEAR React template";
    await this.props.wallet.requestSignIn(
      window.nearConfig.contractName,
      appTitle
    );
  }

  requestSignOut() {
    this.props.wallet.signOut();
    setTimeout(this.signedOutFlow, 500);
    console.log("after sign out", this.props.wallet.isSignedIn());
  }

  async changeGreeting() {
    await this.props.contract.set_greeting({ message: "howdy" });
    await this.welcome();
  }

  signedOutFlow() {
    if (window.location.search.includes("account_id")) {
      window.location.replace(
        window.location.origin + window.location.pathname
      );
    }
    this.setState({
      login: false,
      speech: null,
    });
  }

  async incrementVote(value) {
    await this.props.contract
      .increment_vote({ candidate: value })
      .then(async (result) => {
        if (value === 1) {
          this.setState({
            count1: await this.props.contract.get_candidate_votes({
              candidate: 1,
            }),
          });
        } else {
          this.setState({
            count2: await this.props.contract.get_candidate_votes({
              candidate: 2,
            }),
          });
        }
      });
  }

  async pollButtonClicked(value) {
    console.log("pollButtonClicked(): ", value);
    if (value) {
      // increment
      if (value === 1) {
        this.setState({ count1: "fetching..." });
      } else {
        this.setState({ count2: "fetching..." });
      }

      this.incrementVote(value);
      // await this.props.contract
      //   .increment_vote({ candidate: 1 })
      //   .then(async (result) => {
      //     if (value === 1) {
      //       this.setState({
      //         count1: await this.props.contract.get_candidate_votes({
      //           candidate: 1,
      //         }),
      //       });
      //     } else {
      //       this.setState({
      //         count2: await this.props.contract.get_candidate_votes({
      //           candidate: 2,
      //         }),
      //       });
      //     }
      //   });
    }
  }

  async resetButtonClicked() {
    console.log("resetButtonClicked(): ");
    await this.props.contract.reset_votes().then(async () => {
      this.setState({
        count1: await this.props.contract.get_candidate_votes({
          candidate: 1,
        }),
        count2: await this.props.contract.get_candidate_votes({
          candidate: 2,
        }),
      });
    });
  }

  render() {
    let style = {
      fontSize: "1.5rem",
      color: "#0072CE",
      textShadow: "1px 1px #D1CCBD",
    };
    return (
      <div className="App-header">
        <div className="image-wrapper">
          <img className="logo" src={nearlogo} alt="NEAR logo" />
          <p>
            <span role="img" aria-label="fish">
              🐟
            </span>{" "}
            NEAR protocol is a new blockchain focused on developer productivity
            and useability!
            <span role="img" aria-label="fish">
              🐟
            </span>
          </p>
          <p>
            <span role="img" aria-label="chain">
              ⛓
            </span>{" "}
            This little react app is connected to blockchain right now.{" "}
            <span role="img" aria-label="chain">
              ⛓
            </span>
          </p>
          <p style={style}>{this.state.speech}</p>
        </div>
        <div>
          {this.state.login ? (
            <div>
              <button onClick={this.requestSignOut}>Log out</button>
              <button onClick={this.changeGreeting}>Change greeting</button>
              <div className="poll-buttons">
                <p>Who shall rule the throne?</p>
                <button id="this" onClick={() => this.pollButtonClicked(1)}>
                  Vote for John
                </button>
                <button onClick={() => this.pollButtonClicked(2)}>
                  Vote for Susan
                </button>
              </div>
              <p>
                count1: {this.state.count1 === null ? "..." : this.state.count1}
              </p>
              <p>
                count2: {this.state.count2 === null ? "..." : this.state.count2}
              </p>
              {
                //TODO: only show reset if admin account logged in?
                true === true && (
                  <div className="reset-button">
                    <button onClick={() => this.resetButtonClicked()}>
                      RESET COUNT
                    </button>
                  </div>
                )
              }
            </div>
          ) : (
            <button onClick={this.requestSignIn}>Log in with NEAR</button>
          )}
        </div>
        <div>
          <div className="logo-wrapper">
            <img src={near} className="App-logo margin-logo" alt="logo" />
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <p>
            <span role="img" aria-label="net">
              🕸
            </span>{" "}
            <a className="App-link" href="https://nearprotocol.com">
              NEAR Website
            </a>{" "}
            <span role="img" aria-label="net">
              🕸
            </span>
          </p>
          <p>
            <span role="img" aria-label="book">
              📚
            </span>
            <a className="App-link" href="https://docs.nearprotocol.com">
              {" "}
              Learn from NEAR Documentation
            </a>{" "}
            <span role="img" aria-label="book">
              📚
            </span>
          </p>
        </div>
      </div>
    );
  }
}

export default App;
