import React from 'react';
import '../styles/Home.sass';
import { rtcConfiguration } from '../lib/constants';

interface HomeState {
  localStream: MediaStream | null;
  streaming: boolean;
}

export default class Home extends React.Component<object, HomeState> {
  private localVideoRef: React.RefObject<HTMLVideoElement>;
  private remoteVideoRef: React.RefObject<HTMLVideoElement>;
  private messageInputRef: React.RefObject<HTMLTextAreaElement>;
  private peerConnection: RTCPeerConnection;

  constructor(props: object) {
    super(props);
    this.localVideoRef = React.createRef();
    this.remoteVideoRef = React.createRef();
    this.messageInputRef = React.createRef();
    this.state = {
      localStream: null,
      streaming: false,
    };
    this.toggleVideo = this.toggleVideo.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.peerConnection = new RTCPeerConnection(rtcConfiguration);
    this.peerConnection.ontrack = (event) => {
      console.log(event);
      if (!this.remoteVideoRef.current) return;
      this.remoteVideoRef.current.srcObject = event.streams[0] as MediaStream;
    };
  }

  async skipUser(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    event.preventDefault();
  }

  async toggleVideo(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    const button = event.target as HTMLButtonElement | null;
    const localVideo = this.localVideoRef.current;
    if (!button || !localVideo) return;
    if (this.state.localStream === null) {
      button.innerText = 'Loading...';
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        await new Promise<void>((resolve) =>
          this.setState({ localStream }, resolve)
        );
        localStream.getTracks().forEach(track => this.peerConnection.addTrack(track, localStream));
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        console.log(offer);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error accessing media devices.', error);
        }
        return;
      }
    }

    if (this.state.streaming) {
      button.innerText = 'Start Video';
      localVideo.srcObject = null;
    } else {
      button.innerText = 'Stop Video';
      localVideo.srcObject = this.state.localStream;
    }
    this.setState((prevState) => ({ streaming: !prevState.streaming }));
  }

  async sendMessage(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const input = this.messageInputRef.current;
    if (!input) return;
    try {
      const json = JSON.parse(input.value);
      if (json.type === 'offer') {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(json));
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        console.log(answer);
      } else if (json.type === 'answer') {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(json));
      }

      this.peerConnection.onicecandidate = ({ candidate }) => {
        if (candidate) this.peerConnection.addIceCandidate(candidate);
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
    input.value = '';
  }

  handleMessageInput(event: React.FormEvent<HTMLTextAreaElement>): void {
    const messageInput = event.target as HTMLTextAreaElement | null;
    if (!messageInput) return;
  }

  override render(): React.JSX.Element {
    return (
      <main className="home">
        <div className="sidebar">
          <div className="videos">
            <video ref={this.localVideoRef} autoPlay playsInline></video>
            <video ref={this.remoteVideoRef} autoPlay playsInline></video>
          </div>
          <div className="buttons">
            <button onClick={this.toggleVideo}>Start Video</button>
            <button onClick={this.skipUser}>Skip User</button>
          </div>
        </div>
        <section className="chat-content">
          <ul className="messages-list"></ul>
          <form className="message-form" onSubmit={this.sendMessage}>
            <textarea
              className="message-input"
              ref={this.messageInputRef}
              onInput={this.handleMessageInput}
              spellCheck="false"
            />
            <button className="submit-message">
              <span>Send</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                width="16"
                height="16"
                xmlSpace="preserve"
              >
                <path
                  d="M89.999 3.075c.001-.055.001-.108 0-.163-.004-.134-.017-.266-.038-.398-.007-.041-.009-.081-.018-.122-.034-.165-.082-.327-.144-.484-.018-.046-.041-.089-.061-.134-.053-.119-.113-.234-.182-.346-.028-.046-.056-.092-.087-.138-.102-.147-.212-.288-.341-.417-.13-.13-.273-.241-.421-.344-.042-.029-.085-.056-.129-.082-.118-.073-.239-.136-.364-.191-.039-.017-.076-.037-.116-.053-.161-.063-.327-.113-.497-.147-.031-.006-.063-.008-.094-.014-.142-.024-.285-.038-.429-.041-.048-.001-.095-.001-.142 0-.141.003-.282.017-.423.041-.035.006-.069.008-.104.015-.154.031-.306.073-.456.129L1.946 31.709C.822 32.131.058 33.182.003 34.382c-.054 1.199.612 2.316 1.693 2.838l34.455 16.628 16.627 34.455C53.281 89.344 54.334 90 55.481 90c.046 0 .091-.001.137-.003 1.199-.055 2.251-.819 2.673-1.943L89.815 4.048c.056-.149.097-.3.128-.453.008-.041.011-.081.017-.122.022-.132.035-.265.039-.398zm-14.913 7.597L37.785 47.973 10.619 34.864l64.467-24.192zm-19.95 68.709L42.027 52.216l37.302-37.302-24.193 64.467z"
                  transform="matrix(2.81 0 0 2.81 1.4065934 1.4065934)"
                />
              </svg>
            </button>
          </form>
        </section>
      </main>
    );
  }
}
