import React from 'react';
import '../styles/VerifyEmail.sass';

export default class VerifyEmail extends React.Component {
  private verificationcode: React.RefObject<HTMLInputElement>;

  constructor(props: object) {
    super(props);

    this.verificationcode = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  private async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // const input = this.verificationcode.current;
  }


  override render(): React.JSX.Element {
    return (
      <main className="verify">
        <h2>Signup Form</h2>
        <form onSubmit={this.handleSubmit} className="verificationcode">
          <input ref={this.verificationcode}></input>
          <button>Submit</button>
        </form>
        <p className="invalidfeedback"></p>
      </main>
    );
  }
}
