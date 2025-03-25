<script lang="ts">
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
  name: 'Chat',
  setup() {
    const newMessage = ref('');
    const messages = ref<string[]>([]);

    const sendMessage = async () => {
      if (newMessage.value.trim()) {

        messages.value.push(newMessage.value);
        newMessage.value = ''; 
      }
    };

    return {
      newMessage,
      messages,
      sendMessage
    };
  }
});
</script>

<template>
    <div class="chat-container">
        <div class="messages">
              <p class="message bot">Hej! Vad kan jag hjälpa dig med?</p>
              <p class="message user" v-for="(message, index) in messages" :key="index">{{ message }}</p>
        </div>
        <div class="input-container">
          <input type="text"
          placeholder="Type a message..."
          @keyup.enter="sendMessage"
          v-model="newMessage"
          >
          <button @click="sendMessage">➤</button>
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
input {
  width: 85%;
  padding: 0.5em;
  border-bottom-left-radius: 0.4em;
  outline: none;
  font-family: "Roboto Flex", sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-optical-sizing: auto;
  font-weight: 350;
  font-style: normal;
}
button {
  border: 0;
  cursor: pointer;
  font-size: large;
  color: white;
  width: 15%;
  padding: 0.5em;
  background-color: rgb(137, 137, 240);
  transition-duration: 150ms;
  border-bottom-right-radius: 0.4em;
}
button:hover {
  background-color: rgb(87, 87, 245);
}

.bot {
  background-color: rgb(196, 196, 196);
  border-radius: 0.3em;
  padding: 0.3em;
  margin-left: 0.2em;
  margin-right: auto;
  width: 75%;

}

.user {
  background-color: rgb(68, 62, 243);
  color: white;
  border-radius: 0.3em;
  padding: 0.3em;
  margin-right: 0.2em;
  margin-left: auto;
  max-width: 75%;

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
}
</style>