import React from 'react';
import { RTC_PEER_CONFIGURATION, WEBSOCKET_URL } from '../lib/constants';
import '../styles/Home.sass';

interface ChatMessage {
  author: string;
  content: string;
}

interface SocketMessage {
  type: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidate;
  message?: string;
}

interface HomeState {
  localStream: MediaStream | null;
  streaming: boolean;
  messages: ChatMessage[];
  connected: boolean;
}

export default class Home extends React.Component<object, HomeState> {
  private localVideoRef: React.RefObject<HTMLVideoElement>;
  private remoteVideoRef: React.RefObject<HTMLVideoElement>;
  private messageInputRef: React.RefObject<HTMLTextAreaElement>;
  private messageFormRef: React.RefObject<HTMLFormElement>;
  private peerConnection: RTCPeerConnection = new RTCPeerConnection(
    RTC_PEER_CONFIGURATION
  );
  private socket: WebSocket = new WebSocket(WEBSOCKET_URL);
  private candidates: RTCIceCandidate[] = [];
  private messageCount: number = 0;

  constructor(props: object) {
    super(props);
    this.localVideoRef = React.createRef();
    this.remoteVideoRef = React.createRef();
    this.messageInputRef = React.createRef();
    this.messageFormRef = React.createRef();
    this.state = {
      localStream: null,
      streaming: false,
      messages: [],
      connected: false,
    };
    this.toggleVideo = this.toggleVideo.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.skipUser = this.skipUser.bind(this);
  }

  private isSocketMessage(message: object): message is SocketMessage {
    return (
      'type' in message &&
      (('offer' in message && message.type === 'offer') ||
        ('answer' in message && message.type === 'answer') ||
        ('candidate' in message && message.type === 'candidate') ||
        ('message' in message && message.type === 'message'))
    );
  }

  override componentDidMount(): void {
    this.socket.onmessage = async (event) => {
      if (!event.data) return;

      let messageText;
      try {
        messageText = await event.data.text();
      } catch (error) {
        console.error('Error reading Blob data as text', error);
        return;
      }

      let message;
      try {
        message = JSON.parse(messageText);
      } catch (error) {
        console.error('Error parsing WebSocket message', error);
        return;
      }

      if (!this.isSocketMessage(message)) {
        console.error('Invalid socket message format', message);
        return;
      }

      console.log('Processing message', message);
      switch (message.type) {
        case 'offer': {
          if (!message.offer) return;
          const description = new RTCSessionDescription(message.offer);
          await this.peerConnection.setRemoteDescription(description);
          const answer = await this.peerConnection.createAnswer();
          await this.peerConnection.setLocalDescription(answer);
          this.socket.send(
            JSON.stringify({
              type: 'answer',
              answer,
            })
          );
          break;
        }
        case 'answer': {
          if (!message.answer) return;
          if (
            this.peerConnection.signalingState !== 'have-local-offer' &&
            this.peerConnection.signalingState !== 'stable'
          )
            return;
          if (this.peerConnection.iceConnectionState === 'closed') return;
          const description = new RTCSessionDescription(message.answer);
          await this.peerConnection.setRemoteDescription(description);
          break;
        }
        case 'candidate':
          if (!message.candidate) return;
          if (this.peerConnection.signalingState === 'stable') {
            console.log('Adding candidate to connection', message.candidate);
            this.peerConnection.addIceCandidate(message.candidate);
          } else {
            this.candidates.push(message.candidate);
          }
          break;
        case 'message': {
          let newMessage;
          try {
            newMessage = JSON.parse(message.message as string);
          } catch (error) {
            console.error('Failed to parse chat message', error);
            return;
          }
          if (!newMessage || !newMessage.content) return;
          this.setState((prevState) => ({
            ...prevState,
            messages: [
              ...prevState.messages,
              { content: newMessage.content, author: 'Stranger' },
            ],
          }));
          break;
        }
        default:
          console.error('Unknown message type ' + message.type);
          return;
      }
      return;
    };

    this.socket.onerror = function (error) {
      console.error('WebSocket error:', error);
    };

    this.peerConnection.addEventListener('track', ({ streams }) => {
      if (
        this.remoteVideoRef.current &&
        streams.length > 0 &&
        streams[0] instanceof MediaStream
      ) {
        this.remoteVideoRef.current.srcObject = streams[0];
      }
    });

    this.peerConnection.addEventListener('icecandidate', ({ candidate }) => {
      console.log('Received candidate locally', candidate);
      if (!candidate) return;
      /*if (this.peerConnection.signalingState === 'stable') {
        console.log('Adding candidate to connection', candidate);
        this.peerConnection.addIceCandidate(candidate);
      } else {
        this.candidates.push(candidate);
      }*/
      this.socket.send(
        JSON.stringify({
          type: 'candidate',
          candidate,
        })
      );
    });

    this.peerConnection.addEventListener('signalingstatechange', () => {
      console.log(this.peerConnection.signalingState);
      if (this.peerConnection.signalingState === 'stable') {
        for (const candidate of this.candidates)
          this.peerConnection.addIceCandidate(candidate);
        this.setState({ connected: true });
      } else {
        this.setState({ connected: false });
      }
    });
  }

  async skipUser(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    event.preventDefault();
    console.log('Connected: ', this.state.connected);
  }

  async toggleVideo(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
<<<<<<< HEAD
    const tokenValue = this.getCookieValue('authToken');
    if (tokenValue) {
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
          localStream
            .getTracks()
            .forEach((track) => this.peerConnection.addTrack(track, localStream));
=======
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
        localStream
          .getTracks()
          .forEach((track) => this.peerConnection.addTrack(track, localStream));
        if (confirm('Set offer?')) {
>>>>>>> cd99db7c5d1e5dabc85807755ed01f5091ba8b61
          const offer = await this.peerConnection.createOffer();
          await this.peerConnection.setLocalDescription(offer);
          this.socket.send(
            JSON.stringify({
              type: 'offer',
              offer,
            })
          );
<<<<<<< HEAD
        } catch (error) {
          if (error instanceof Error) {
            console.error('Error accessing media devices.', error);
          }
          return;
=======
        }
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

  handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    const textarea = event.target as HTMLTextAreaElement | null;
    if (!textarea) return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.messageFormRef.current?.requestSubmit();
    }
  }

  async sendMessage(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const input = this.messageInputRef.current;
    if (!input || !input.value) return;
    const content = input.value;
    this.setState((oldState) => ({
      ...oldState,
      messages: [...oldState.messages, { author: 'You', content }],
    }));
    this.socket.send(
      JSON.stringify({
        type: 'message',
        message: JSON.stringify({
          content,
        }),
      })
    );
    input.value = '';
  }

  /*async skipUser(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    event.preventDefault();
    console.log('Connected: ', this.state.connected);
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
        localStream
          .getTracks()
          .forEach((track) => this.peerConnection.addTrack(track, localStream));
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        this.socket.send(
          JSON.stringify({
            type: 'offer',
            offer,
          })
        );
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error accessing media devices.', error);
>>>>>>> cd99db7c5d1e5dabc85807755ed01f5091ba8b61
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
      } else {
        window.location.href =  '/login';
      }
  }

  handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    const textarea = event.target as HTMLTextAreaElement | null;
    if (!textarea) return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.messageFormRef.current?.requestSubmit();
    }
  }

  async sendMessage(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const input = this.messageInputRef.current;
    if (!input || !input.value) return;
    const content = input.value;
    this.setState((oldState) => ({
      ...oldState,
      messages: [...oldState.messages, { author: 'You', content }],
    }));
    this.socket.send(
      JSON.stringify({
        type: 'message',
        message: JSON.stringify({
          content,
        }),
      })
    );
    input.value = '';
  }*/

   getCookieValue(cookieName: string): string | undefined {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');

    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === cookieName) {
        return value;
      }
    }
    return undefined;
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
          <ul className="messages-list">
            {this.state.messages.map((message) => (
              <li key={this.messageCount++}>
                <span className={message.author.toLowerCase()}>
                  {message.author}:
                </span>{' '}
                {message.content}
              </li>
            ))}
          </ul>
          <form
            ref={this.messageFormRef}
            className="message-form"
            onSubmit={this.sendMessage}
          >
            <textarea
              className="message-input"
              ref={this.messageInputRef}
              onKeyDown={this.handleKeyDown}
              spellCheck="false"
            />
            <button className="submit-message">
              <span>Send</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                width="15"
                height="15"
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
