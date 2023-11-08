<script>
import Expert from './expert.svelte'
</script>

<div class="expert-comitee-label">Your Expert Committee:</div>
<div class="experts">
    <Expert/>
    <Expert/>
    <Expert/>
    <Expert/>
</div>

<style>

    .expert-comitee-label{
        font-size: 24px;
        font-family: 'Ubuntu Bold';
        color: #3EA2FF;
    }

    .experts{
        display: flex;
        justify-content: space-between;
        gap: 10px;
        padding: 15px;
    }
    
</style>