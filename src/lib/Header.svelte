<script lang="ts">
  import HeaderLink from '$lib/HeaderLink.svelte'
  import SNSaccount from '$lib/SNSaccount.svelte'
</script>

<header class="fixed w-full bg-white shadow-md h-14">
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
    integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />

  <nav class="flex justify-center sm:justify-between items-center">
    <h2 class="hidden sm:flex px-4 text-base">
      <a href="/">
        <span class="font-sans text-xl font-bold">しゅおりり</span>
        <span class="font-sans text-base font-bold">.online</span></a
      >
    </h2>
    <div class="flex space-x-6">
      <HeaderLink href="/">Home</HeaderLink>
    </div>
    <div>
      <SNSaccount />
    </div>
  </nav>
</header>
