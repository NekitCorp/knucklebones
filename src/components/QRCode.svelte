<script lang="ts">
    import QRCode from 'qrcode';
    import { onDestroy, onMount } from 'svelte';

    // Props

    export let value: string;
    export let width: number = 200;

    // Variables

    let image = '';
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

    // Functions

    function getColors(isDark: boolean) {
        return isDark ? { dark: '#ffffffde', light: '#2f2f2fff' } : { dark: '#000000ff', light: '#ffffffff' };
    }

    async function generateQrCode() {
        image = await QRCode.toDataURL(value, { width: width, color: getColors(mediaQueryList.matches) });
    }

    function onColorSchemeChange(e: MediaQueryListEvent) {
        generateQrCode();
    }

    // Lifecycle

    $: {
        if (value) {
            generateQrCode();
        }
    }

    onMount(() => {
        mediaQueryList.addEventListener('change', onColorSchemeChange);
    });

    onDestroy(() => {
        mediaQueryList.removeEventListener('change', onColorSchemeChange);
    });
</script>

<img src={image} alt={value} />
