import './app.css';
import App from './App.svelte';
import './reset.css';

const app = new App({
    target: document.getElementById('app') as HTMLElement,
});

export default app;
