import React from 'react';
import '../styles/Signup.sass';
import VerifyEmail from './VerifyEmail';

interface SignupState {
  email: string;
  isSubmitted: boolean;
}

export default class Signup extends React.Component<
  Record<string, never>,
  SignupState
> {
  private email: React.RefObject<HTMLInputElement>;

  constructor(props: Record<string, never>) {
    super(props);

    this.state = {
      email: '',
      isSubmitted: false,
    };

    this.email = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  private async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input = this.email.current;

    if (input && this.isValidEmail(input.value)) {
      this.setState({ email: input.value, isSubmitted: true });

      try {
        const response = await fetch(
          'http://localhost:3001/send-verification',
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
          <input ref={this.email} type="email" placeholder="Enter your email" />
          <button>Submit</button>
        </form>
        <p className="invalidemailfeedback"></p>

        {this.state.isSubmitted && <VerifyEmail propemail={this.state.email} />}
      </main>
    );
  }
}
