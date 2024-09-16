import React from 'react';
import '../styles/Home.sass';

export default class Home extends React.Component {
  private localVideoRef: React.RefObject<HTMLVideoElement>;
  private remoteVideoRef: React.RefObject<HTMLVideoElement>;
  private localStream: MediaStream | null;
  private streaming: boolean;

  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.localVideoRef = React.createRef();
    this.remoteVideoRef = React.createRef();
    this.localStream = null;
    this.streaming = false;
    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    const button = event.target as HTMLButtonElement | null;
    const localVideo = this.localVideoRef.current;
    if (!button || !localVideo) return;
    if (this.localStream === null) {
      button.innerText = 'Loading...';
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error accessing media devices.', error);
        }
      }
    }

    if (this.streaming) {
      button.innerText = 'Start Video';
      localVideo.srcObject = null;
    } else {
      button.innerText = 'Stop Video';
      localVideo.srcObject = this.localStream;
    }
    this.streaming = !this.streaming;
  }

  override render(): React.JSX.Element {
    return (
      <section className="home">
        <div className="video-grid">
          <video ref={this.localVideoRef} autoPlay playsInline></video>
          <video ref={this.remoteVideoRef} autoPlay playsInline></video>
        </div>
        <button onClick={this.handleClick}>Start Video</button>
      </section>
    );
  }
}
