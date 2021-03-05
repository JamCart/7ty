<script>
import saved_products from '$src/store/products.js'

export let id
export let title

$: saved = $saved_products.includes(id)

function save () {
  saved_products.update(value => {
    return [...value, id]
  })
}

function remove () {
  saved_products.update(value => {
    return value.filter(item => item !== id)
  })
}
</script>

{#if saved}
  <button class="saved" on:click={ remove } type="button">
    Saved!
  </button>
{:else}
  <button disabled={ !process.browser } on:click={ save } type="button">
    Save { title }
  </button>
{/if}

<style>
button {
  background: #999;
  border: 2px solid #999;
  border-radius: .5em;
  color: white;
  cursor: pointer;
  display: block;
  font-size: 110%;
  padding: .5em;
  width: 100%;
}
button.saved {
  background: none;
  border-color: #333;
  color: #333; 
}
</style>
