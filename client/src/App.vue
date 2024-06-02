<template>
  <div class="app">
      <Sidebar v-if="shouldShowSidebar"/>
      <router-view />
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'

export default {
  components: {
    Sidebar, 
  },

  computed:{
    shouldShowSidebar() {
      return this.$route.meta.sidebar!==false;
    }
  }
};
</script>


<style lang="scss">
:root {
  --yellow: #faca78;
  --teal: #68c7c1;
  --orange: #f57f5b;
  --red: #dd5341;
  --brown: #794a3a;
  --grey: #fafafa;
  --light: #f1f5f9;
  --dark: #1e293b;
  --dark-alt: #334155;
  --sidebar-width: 300px;
}

*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
}

body {
  background: var(--light);
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

html {
  overflow-y: auto 
}

.app {
  display: flex;

  main {
    flex: 1 1 0;
    padding: 2rem;
    
    @media (max-width: 768px) {
      padding-left: 6rem;
    }
  }
}

</style>