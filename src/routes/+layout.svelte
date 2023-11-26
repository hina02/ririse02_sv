<script lang="ts">
    import "../app.css";
    import Header from "$lib/Header.svelte";
    import Footer from "$lib/Footer.svelte";

    export let pageTitle = 'デフォルトのタイトル';

</script>

<svelte:head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Lato&family=Noto+Sans+JP&family=Zen+Maru+Gothic&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <title>{pageTitle}</title>
</svelte:head>
<body class="font-notoJP">
	<Header/>
	<Footer/>
</body>
<slot />
