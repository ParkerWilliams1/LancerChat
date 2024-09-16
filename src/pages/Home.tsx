import React from 'react';
import '../styles/Home.sass';

interface HomeState {
  localStream: MediaStream | null;
  streaming: boolean;
}

export default class Home extends React.Component<object, HomeState> {
  private localVideoRef: React.RefObject<HTMLVideoElement>;
  private remoteVideoRef: React.RefObject<HTMLVideoElement>;

  constructor(props: object) {
    super(props);
    this.localVideoRef = React.createRef();
    this.remoteVideoRef = React.createRef();
    this.state = {
      localStream: null,
      streaming: false,
    };
    this.toggleVideo = this.toggleVideo.bind(this);
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

  override render(): React.JSX.Element {
    return (
      <main className="home">
        <div className="video-sidebar">
          <video ref={this.localVideoRef} autoPlay playsInline></video>
          <video ref={this.remoteVideoRef} autoPlay playsInline></video>
          <button onClick={this.toggleVideo}>Start Video</button>
          <button onClick={this.skipUser}>Skip User</button>
        </div>
        <div className="chat-container">
          <div className="chat-messages"></div>
          <textarea />
        </div>
      </main>
    );
  }
}
