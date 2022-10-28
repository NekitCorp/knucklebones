<script lang="ts">
    import { onMount } from 'svelte';
    import QRious from 'qrious';

    const qr = new QRious();

    export let errorCorrection = 'L';
    export let background = '#fff';
    export let color = '#000';
    export let size = '200';
    export let value: string;
    export let padding = 0;
    export let className = 'qrcode';

    let image = '';

    function generateQrCode() {
        qr.set({
            background,
            foreground: color,
            level: errorCorrection,
            padding,
            size,
            value,
        });

        image = qr.toDataURL('image/jpeg');
    }

    export function getImage() {
        return image;
    }

    $: {
        if (value) {
            generateQrCode();
        }
    }

    onMount(() => {
        generateQrCode();
    });
</script>

<div class="wrapper">
    <img src={image} alt={value} class={className} />
</div>

<style>
    .wrapper {
        background: #fff;
        padding: 4px;
    }
</style>
