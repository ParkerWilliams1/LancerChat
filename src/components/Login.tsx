import React from 'react';
import '../styles/Login.sass';

export default class Login extends React.Component {
  private email: React.RefObject<HTMLInputElement>;
  private password: React.RefObject<HTMLInputElement>;

  constructor(props: object) {
    super(props);

    this.email = React.createRef();
    this.password = React.createRef();
  }



  override render(): React.JSX.Element {
    return (
      <main className="login">
        <h2>Login Form</h2>
        <form className="email">
          <input ref={this.email}></input>
          <input ref={this.password}></input>
          <button>Submit</button>
        </form>
        <p className="invalidemailfeedback"></p>
      </main>
    );
  }
}
