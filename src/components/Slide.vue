<script setup>
  defineProps(['slide']);
</script>

<template>
  <section>{{ JSON.stringify(slide) }}</section>
</template>