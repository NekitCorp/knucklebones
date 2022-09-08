<script lang="ts">
    export let textToCopy: string;
    let wait = false;

    function copy() {
        navigator.clipboard.writeText(textToCopy).then(
            () => {
                console.log('Async: Copying to clipboard was successful!');
                wait = true;
                setTimeout(() => (wait = false), 2000);
            },
            (err) => console.error('Async: Could not copy text: ', err),
        );
    }
</script>

<button class="btn" on:click={copy}>{wait ? '✔️' : '📋'} {wait ? 'Copied!' : 'Copy'}</button>
