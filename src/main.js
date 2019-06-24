import App from './App.svelte';

let path = '/wp-content/themes/bunker36/js/';

let target = document.querySelector('#app');

const app = new App({
  target: target,
  props: {
    appTypeProp: target.dataset.apptype,
    path: path
  }
});

export default app;