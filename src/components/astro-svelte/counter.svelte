<script lang="ts">
    let count = $state(0)
</script>
<section>
    <div>Count is {count}</div>
    <button onclick={()=>{count++}}>Increase count</button>
</section>
<style>
    section{
        padding:2rem;
        font-family: sans-serif;
    }
</style>