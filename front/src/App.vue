<script setup lang="ts">
import Chat from "./components/Chat.vue";

</script>


<template>
  <div class="title">
      <h1>Supportly</h1>
      <p class="disclaimer">Disclaimer: This is not a real customer support chatbot and is only built as a proof of concept, read more <a class="link" href="https://github.com/adorabyul/supportly">here.</a></p>
  </div>
  
    <Chat/>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Cherry+Bomb+One&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap");
  body {
    margin: 0;
    padding: 0;
  }
  #app {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100svh;
    background-color: rgb(46, 46, 46);
  }

  h1 {
    color: white;
    font-family: "Cherry Bomb One", system-ui;
    font-weight: 400;
    font-size: 3em;
    font-style: normal;

  }
  
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .disclaimer {
    color: white;
    font-family: "Roboto Flex", sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-optical-sizing: auto;
    font-weight: 350;
    max-width: 18em;
    font-style: normal;
  }

  .link {
    color: #4663ac;
  }

  .link:visited {
    color: #4663ac;
  }

</style>