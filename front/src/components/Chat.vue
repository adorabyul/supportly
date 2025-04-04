<script lang="ts">
  import { defineComponent, ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
  import { WebSocketService } from "../services/chatService";
  import { sendAudio } from '../services/sendAudio';

  export default defineComponent({
  name: 'Chat',
  setup() {
    const newMessage = ref('');
    const messages = ref<{text: string | null, sender: string, isTyping: boolean}[]>([]);
    let isDisabled = ref(false);
    const isRecording = ref(false);
    let mediaRecorder: MediaRecorder | null = null;
    let audioChunks: Blob[] = [];
    let audioBlob: Blob = new Blob;
    const audioUrl = ref<string | null>(null);
    let timeoutId = 15000;
    let stream: MediaStream | null = null;
    let wsService: WebSocketService | null = null;
    const wsUrl = import.meta.env.VITE_WEBSOCKET_URL;
    const messageContainer = ref<HTMLElement | null>(null);
    const inputField = ref<HTMLInputElement | null>(null);

    onMounted(() => {
      wsService = new WebSocketService(wsUrl);
      focusInputIfPC();
      wsService.setOnMessageCallback((message: string) => {
        messages.value.pop();
        messages.value.push({text: message, sender: 'bot', isTyping: false});
        isDisabled.value = false;
        focusInputIfPC();
        scrollToBottom();
        
      });
    });

    onUnmounted(() => {
      if (wsService) wsService.close();
      
    });
    
    const scrollToBottom = () => {
      nextTick(() => {
        if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
         };
        })
      }
     
    watch(messages, () => {
       scrollToBottom(); 
    });

    const focusInputIfPC = () => {
      if (window.innerWidth > 1024 && inputField.value) {
        nextTick(() => {
          inputField.value?.focus();
        })
      }
    };

    const sendMessage = async () => {
      
      if(audioUrl.value)
      {
        isDisabled.value = true;
        messages.value.push({text: null, sender: 'user', isTyping: true});
        messages.value.push({text: null, sender: 'bot', isTyping: true});
        const response: any = await sendAudio(audioBlob);
        const transcription = response.transcription.text;
        const botreply = response.text;

        messages.value.pop();
        messages.value.pop();

        messages.value.push({text: transcription, sender: transcription.length < 24 ? 'user_audio_short' : 'user_audio_long', isTyping: false})
        messages.value.push({text: botreply, sender: 'bot', isTyping: false})
        audioUrl.value = null;
        isDisabled.value = false;
        
      }
      else if (wsService && newMessage.value.trim()) {
        
        messages.value.push({ text: newMessage.value, sender: 'user', isTyping: false});
        messages.value.push({text: null, sender: 'bot', isTyping: true});
        wsService.sendMessage(newMessage.value);
        isDisabled.value = true;
        newMessage.value = '';
      }
      scrollToBottom();
      focusInputIfPC();
    };
    
    const startRecording = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      audioUrl.value = URL.createObjectURL(audioBlob);
      audioChunks = [];
    };

    mediaRecorder.start();
    isRecording.value = !isRecording.value;

    timeoutId = setTimeout(stopRecording, 15000);

  } catch (error) {
    console.error("Error accessing microphone:", error);
  }
};

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state === 'recording' && stream !== null) {
    mediaRecorder.stop();
    stream.getTracks().forEach(track => track.stop());
  }
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  isRecording.value = !isRecording.value;
};

const toggleRecording = () => {
  if (isRecording.value) {

    stopRecording();
  } else {

    startRecording();
  }
};

    return {
      newMessage,
      messages,
      sendMessage,
      isDisabled,
      isRecording,
      toggleRecording,
      audioUrl,
      messageContainer,
      inputField
    };

    
  }  
  
});


</script>

<template>
    <div class="chat-container">
        <div class="messages" ref="messageContainer">
              <p class="message bot">Welcome to the chat! How can I assist you today?</p>
              <p class="message" :class="message.sender" v-for="(message, index) in messages" :key="index">
                {{ message.text }}
               
                   <img class="loading" v-if="message.isTyping && message.sender === 'bot'" src="../assets/fade-stagger-circles-black.svg" alt="Typing"></img>
                   <img class="loading" v-if="message.isTyping && message.sender === 'user'" src="../assets/fade-stagger-circles-white.svg" alt="Typing"></img>
             
              </p>
        </div>
        
        <div class="input-container" >
          <audio class="audio" v-if="audioUrl" :src="audioUrl" controls />
          <input v-if="!audioUrl" type="text"
          ref="inputField"
          :disabled="isDisabled"
          placeholder="Type a message..."
          @keyup.enter="sendMessage"
          v-model="newMessage"
          >
          <button :disabled="isDisabled" @click="toggleRecording" class="record">
            <img v-if="isRecording" src="../assets/stop_recording.svg"/>
            <img v-else src="../assets/mic.svg" alt="Start Recording"/>
          </button>
          <button class="send" @click="sendMessage" :disabled="isDisabled || (newMessage.length < 1 && !audioUrl)"><img v-if="isDisabled" src="../assets/spinning-dots.svg" alt="Loading"></img><span v-else>➤</span></button>
        </div>
        
    </div>

</template>

<style scoped>

@import url("https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap");
.chat-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  height: 30em;
  width: 20em;
  background-color: rgb(248, 248, 248);
  border-radius: 0.5em;
  
}

.input-container {
  display: flex;
  width: 100%;

}
.audio {
  width: 70%;
}

input {
  width: 70%;
  padding: 0.5em;
  border-bottom-left-radius: 0.4em;
  border: 2px solid transparent;
  outline: none;
  font-family: "Roboto Flex", sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-optical-sizing: auto;
  font-weight: 350;
  font-style: normal;
  font-size: 16px;
  transition: all 0.5s;
  background-color: #E2E6E9;
  border-right: 1px solid rgb(67, 67, 67, 70%);
}

input:hover,
input:focus {
  border: 2px solid #4A9DEC;
  box-shadow: 0px 0px 0px 2px rgb(74, 157, 236, 20%);
  background-color: white;
}

.record {
  width: 15%;
  border: none;
  background-color: #E2E6E9;
  cursor: pointer;
}

.record:hover {
  background-color:rgb(190, 190, 190);

}

img {
  width: 80%;
  height: 80%;
}

.send {
  border: 0;
  cursor: pointer;
  font-size: large;
  color: white;
  width: 15%;
  padding: 0.5em;
  background-color: #619CF2;
  transition-duration: 150ms;
  border-bottom-right-radius: 0.4em;
}
.send:hover {
  background-color: rgb(87, 87, 245);
}

.bot {
  background-color: #E2E6E9;
  border-radius: 0.3em;
  padding: 0.3em;
  margin-left: 0.2em;
  margin-right: auto;
  max-width: 75%;
  position: relative;
}

.user {
  background-color: #619CF2;
  color: white;
  border-radius: 0.3em;
  padding: 0.3em;
  margin-right: 0.2em;
  margin-left: auto;
  max-width: 75%;
  position: relative;
}

.user::before {
  content: "You";
  position: absolute;
  top: -15px;
  font-size: 0.9em;
  color: black;
}

.user_audio_long {
  background-color: #619CF2;
  color: white;
  border-radius: 0.3em;
  padding: 0.3em;
  margin-right: 0.2em;
  margin-left: auto;
  max-width: 75%;
  position: relative;
}

.user_audio_long::before {
  content: "You sent an audio recording";
  position: absolute;
  top: -15px;
  font-size: 0.9em;
  white-space: nowrap;
  color: black;
}
.user_audio_short {
  background-color: #619CF2;
  color: white;
  border-radius: 0.3em;
  padding: 0.3em;
  margin-right: 0.2em;
  margin-left: auto;
  max-width: 75%;
  position: relative;
}

.user_audio_short::before {
  content: "You sent an audio recording";
  position: absolute;
  top: -15px;
  font-size: 0.9em;
  color: black;
  transform: translateX(-77%);
  white-space: nowrap;
  width: max-content;
}

.bot::before {
  content: "Supportly Customer Agent";
  position: absolute;
  top: -15px;
  font-size: 0.9em;
  color: black;
  white-space: nowrap;
  width: max-content;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 0.1em;
  width: 100%;
  padding-top: 0.5em;
  font-family: "Roboto Flex", sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-optical-sizing: auto;
  font-weight: 350;
  font-style: normal;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;

}


.loading {
  height: 1.5em;
  width: auto;
}

@media (max-width: 500px) {
  .chat-container {
    width: 100vw;
    height: 90%;
  }
}
</style>