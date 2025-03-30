<script setup lang="ts">
import Chat from "./components/Chat.vue";

</script>


<template>
  <h1>Supportly</h1>
    <Chat/>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Cherry+Bomb+One&display=swap");
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

</style>