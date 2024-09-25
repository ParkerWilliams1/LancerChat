import React from 'react';
import '../styles/Signup.sass';

export default class Signup extends React.Component {
  private email: React.RefObject<HTMLInputElement>;

  constructor(props: object) {
    super(props);

    this.email = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  private async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input = this.email.current;

    if (input) {
      if (this.isValidEmail(input.value)) {
        try {
          const response = await fetch(
            'http://localhost:3000/send-verification',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: input.value }),
            }
          );

          if (response.ok) {
            console.log('Verification email sent.');
          } else {
            console.error('Error sending verification email.');
          }
        } catch (error) {
          console.error('Fetch error:', error);
        }
      } else {
        this.handleInvalidEmail();
      }
    }
  }

  private handleInvalidEmail() {
    const invalidEmailMessage = document.getElementsByClassName(
      'invalidemailfeedback'
    )[0] as HTMLParagraphElement;
    invalidEmailMessage.innerHTML =
      'Invalid Email Entry: (ex.JohnB.Smith@calbaptist.edu)';
    invalidEmailMessage.style.color = 'red';
  }

  private isValidEmail(email: string) {
    const validEmailMessage = document.getElementsByClassName(
      'invalidemailfeedback'
    )[0] as HTMLParagraphElement;
    validEmailMessage.innerHTML = 'Verification Email Sent!';
    validEmailMessage.style.color = 'green';
    return (
      email.endsWith('calbaptist.edu') &&
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    );
  }

  override render(): React.JSX.Element {
    return (
      <main className="Signup">
        <h2>Signup Form</h2>
        <form onSubmit={this.handleSubmit} className="email">
          <input ref={this.email}></input>
          <button>Submit</button>
        </form>
        <p className="invalidemailfeedback"></p>
      </main>
    );
  }
}
