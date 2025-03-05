import { Component, OnInit } from '@angular/core';
import { ChatserviceService } from 'src/app/service/chat/chatservice.service';
import { User, Channel } from 'stream-chat';
import {
  ChatClientService,
  ChannelService,
  StreamI18nService,
  DefaultStreamChatGenerics,
} from 'stream-chat-angular';
@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent implements OnInit {
  private channel: Channel<DefaultStreamChatGenerics> | undefined;
  constructor(
    private chatService: ChatClientService,
    private channelService: ChannelService,
    private streamI18nService: StreamI18nService,
    private chatbotService: ChatserviceService
  ) {
    const apiKey = 'mxnzfu5g3w7t';
    const userId = 'John';
    const userToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiSm9obiJ9.ntGN1NSfSVZ2c1BCweqA8JgEywZ1A-O0teXXDv_kyNc';
    const userName = 'John';

    const user: User = {
      id: userId,
      name: userName,
      image: `https://getstream.io/random_png/?name=${userName}`,
    };

    this.chatService.init(apiKey, user, userToken);
    this.streamI18nService.setTranslation();
  }

  async ngOnInit() {
    try {
      this.channel = this.chatService.chatClient.channel(
        'messaging',
        'gencart-bot',
        {
          image:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/2048px-Angular_full_color_logo.svg.png',
          name: 'GenCart Bot',
        }
      );

      // Ensure the channel is created before proceeding
      await this.channel.watch(); // Changed from `create` to `watch`
      this.channelService.init({
        type: 'messaging',
        id: { $eq: 'gencart-bot' },
      });

      // Now that the channel is initialized, attach the event listener
      // this.channel.on('message.new', this.onMessageSent.bind(this));
      this.channel.on('message.new', this.onMessageSent.bind(this));
    } catch (error) {
      console.error('Error during channel initialization:', error);
    }
  }

  private onMessageSent(event: any) {
    const newMessage = event.message;
    console.log('New message sent:', newMessage);

    // Access the message text
    const messageText = newMessage.text;
    console.log(newMessage.user.id);
    
    if (newMessage.user && newMessage.user.id !== 'GenCartBot') {
      // Check if the message is "hi" and process it
      if (messageText) {
        console.log('User sent a greeting:', messageText);
        // Call your Flask server or perform any other processing here
        this.chatbotService.processQuery(messageText);
      }
    }
  }

  ngOnDestroy() {
    this.chatService.chatClient.disconnectUser();
    this.chatService.chatClient.closeConnection();
  }
}
