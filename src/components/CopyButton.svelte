<script lang="ts">
    export let textToCopy: string;
    let copyButtonText = 'Copy';

    function copy() {
        navigator.clipboard.writeText(textToCopy).then(
            () => {
                console.log('Async: Copying to clipboard was successful!');
                copyButtonText = 'Copied!';
                setTimeout(() => (copyButtonText = 'Copy'), 2000);
            },
            (err) => console.error('Async: Could not copy text: ', err),
        );
    }
</script>

<button class="btn" on:click={copy}>{copyButtonText}</button>
