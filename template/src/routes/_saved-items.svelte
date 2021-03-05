<script>
import products from '$src/store/products.js'

$: length = $products.length
</script>

{#if process.browser}
  <p>{ length } Item{#if length !== 1 }s{/if} Saved</p>
{/if}

<style>
p {
  font-size: 120%;
}
</style>
