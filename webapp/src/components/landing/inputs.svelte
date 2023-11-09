<script>
    import ArrowBack from '../../assets/svg/arrow_back.svelte'

    import Code from './code.svelte'
    import Surname from './surname.svelte';
    import Name from './name.svelte';
    import Mail from './mail.svelte';

</script>

<div class="code-input-container">
    <Code/>
    <Surname/>
    <Name/>
    <Mail/>
</div>

<style lang="scss">

.code-input-container{
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 5%;
}

</style>