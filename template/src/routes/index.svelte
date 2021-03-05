<script>
import products from '$src/data/products.js'

import Layout from './_layout.svelte'
import Welcome from './_welcome.svelte'
</script>

<svelte:head>
  <title>7ty</title>
</svelte:head>

<Layout>
  <Welcome />
  <ul>
    {#each Object.values(products) as product}
      <li>
        <a href="/products/{ product.slug }/">
          <figure>
            <img alt="" src={ product.image } height="828" width="640" />
            <figcaption>{ product.title }</figcaption>
          </figure>  
        </a>
      </li>
    {/each}
  </ul>
</Layout>

<style>
ul {
  display: grid;
  font-size: 120%;
  font-weight: bold;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: center;
}
li {
  padding: .5rem;
}
a {
  color: inherit;
  display: block;
  text-decoration: none;
  padding: .5rem;
}
a:focus,
a:hover {
  box-shadow: 0 0 0 2px #666;
}
</style>
