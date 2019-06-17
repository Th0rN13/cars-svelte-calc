import App from './App.svelte';

const app = new App({
  target: document.querySelector('#app'),
  props: {
    type: 'tint'
  }
});

export default app;