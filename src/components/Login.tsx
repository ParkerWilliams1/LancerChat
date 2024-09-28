import React from 'react';
import '../styles/Login.sass';
import VerifyEmail from './VerifyEmail';

interface LoginState {
  email: string;
  isSubmitted: boolean;
}

export class Login extends React.Component<Record<string, never>, LoginState> {
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
        const response = await fetch('http://localhost:3002/loginverification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: input.value }),
        });

        if (response.ok) {
          console.log("Login verification email sent.");
        } else {
          console.error("Error sending login verification email.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
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
    validEmailMessage.innerHTML = 'Login Verification Email Sent!';
    validEmailMessage.style.color = 'green';
    return (
      email.endsWith('calbaptist.edu') &&
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    );
  }

  override render(): React.JSX.Element {
    if (this.state.isSubmitted) {
      return <VerifyEmail propemail={this.state.email} />;
    }

    return (
      <main className="Login">
        <h2>Login Form</h2>
        <form onSubmit={this.handleSubmit} className="email">
          <input ref={this.email} type="email" placeholder="Enter your email" />
          <button>Submit</button>
        </form>
        <p className="invalidemailfeedback"></p>
      </main>
    );
  }
}
