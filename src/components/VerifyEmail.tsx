import React, { Component } from 'react';
import '../styles/VerifyEmail.sass';

interface VerifyEmailProps {
  propemail: string;
}

interface VerifyEmailState {
  verificationCode: string;
  isVerified: boolean;
  errorMessage: string;
}

class VerifyEmail extends Component<VerifyEmailProps, VerifyEmailState> {
  constructor(props: VerifyEmailProps) {
    super(props);
    this.state = {
      verificationCode: '',
      isVerified: false,
      errorMessage: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleVerify = this.handleVerify.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ verificationCode: event.target.value });
  }

  async handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3002/verify-code', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email: this.props.propemail,
              code: this.state.verificationCode,
          }),
      });
  
      if (response.ok) {
          const data = await response.json();
          const { token } = data; 

          if (token) {
              // localStorage.setItem('token', token); This will be removed for cookies
              document.cookie = `authToken=${token}`
              console.log('JWT Token:', token);
          }
  
          this.setState({ isVerified: true, errorMessage: '' });
          console.log('Email verified successfully!');
  
          // Redirect to homepage after successful verification
          setTimeout(() => {
              window.location.href = '/';
          }, 1000);
      } else {
          const errorData = await response.json();
          this.setState({ errorMessage: errorData.message });
          console.error('Verification failed:', errorData.message);
      }
    } catch (error) {
      console.error('Error during verification:', error);
      this.setState({ errorMessage: 'An error occurred during verification.' });
    }
  
  }

  override render() {
    if (this.state.isVerified) {
      return <p>Email verified successfully!</p>;
    }

    return (
      <div className="VerifyEmail">
        <h3>Verify your email</h3>
        <p>Please enter the verification code sent to: {this.props.propemail}</p>

        <form onSubmit={this.handleVerify}>
          <input
            type="text"
            value={this.state.verificationCode}
            onChange={this.handleChange}
            placeholder="Please Enter verification code"
          />
          <button type="submit">Verify</button>
        </form>

        {this.state.errorMessage && (
          <p style={{ color: 'red' }}>{this.state.errorMessage}</p>
        )}
      </div>
    );
  }
}

export default VerifyEmail;
