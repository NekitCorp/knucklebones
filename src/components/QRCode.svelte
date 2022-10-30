<script lang="ts">
    import QRCode from 'qrcode';

    export let value: string;
    let image = '';

    async function generateQrCode() {
        image = await QRCode.toDataURL(value, { width: 200 });
    }

    $: {
        if (value) {
            generateQrCode();
        }
    }
</script>

<img src={image} alt={value} />
