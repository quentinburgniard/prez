<script setup>
  import { ref, watch } from 'vue';
  import Slide from './components/Slide.vue';
  import Reveal from 'reveal.js';

  const presentation = ref({});
  const presentationID = ref(getPresentationID() || '');
  const token = ref(getToken());

  getPresentation(presentationID.value);

  function getPresentation(ID) {
    fetch('https://api.digitalleman.com/v2/presentations/' + ID + '?populate=slides', {
      headers: {
        'authorization': `Bearer ${token.value}`,
        'content-type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.error && [401, 403].includes(data.error.status)) {
        redirect();
      } else {
        presentation.value = data.data;
        let reveal = new Reveal();
        reveal.initialize();
      }
    });
  }

  function getPresentationID() {
    return location.pathname.slice(1).split('/')[0];
  }

  function getToken() {
    let match = document.cookie.match(/t=([^;]+)/);
    if (match && match[1]) {
      return match[1];
    } else {
      redirect();
    }
  }

  function redirect() {
    window.location.href = 'https://id.digitalleman.com?r=prez.digitalleman.com/' + presentationID.value;
  }
</script>

<template>
  <div class="reveal">
    <div class="slides">
      <Slide v-for="slide in presentation.attributes.slides" :key="slide.id" :slide="slide"/>
    </div>
  </div>
</template>