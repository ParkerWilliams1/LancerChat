import React from 'react';

export default class Signup extends React.Component {
  private email: React.RefObject<HTMLInputElement>;

  constructor(props: object) {
    super(props);

    this.email = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  private handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input = this.email.current;

    if (input) {
      console.log(this.isValidEmail(input.value));

      if (this.isValidEmail(input.value)) {
        // Send User Email Verification Code
      }
    }
  }

  private isValidEmail(email: string) {
    return email.endsWith('calbaptist.edu') && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }  

  override render(): React.JSX.Element {
    return (
      <main className="Signup">
        <h2>Signup Form</h2>
        <p>signup form here</p>
        <form onSubmit={this.handleSubmit} className="email">
          <input ref={this.email}></input>
          <button>Submit</button>
        </form>
      </main>
    );
  }
}
