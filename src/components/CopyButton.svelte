<script lang="ts">
    export let textToCopy: string;
    let wait = false;

    function copy() {
        navigator.clipboard.writeText(textToCopy).then(
            () => {
                wait = true;
                setTimeout(() => (wait = false), 2000);
            },
            (err) => console.error('Could not copy text: ', err),
        );
    }
</script>

<button class="btn" on:click={copy}>{wait ? '✔️' : '📋'} {wait ? 'Copied!' : 'Copy'}</button>
