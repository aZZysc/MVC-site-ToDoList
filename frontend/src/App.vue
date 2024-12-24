<template>
  <div id="app">
    <router-view></router-view> <!-- Место, где рендерятся компоненты в зависимости от маршрута -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f7f7f7;
}
</style>
