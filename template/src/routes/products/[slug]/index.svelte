<script context="module">
import products from '$src/data/products.js'
import Layout from '$src/routes/_layout.svelte'

export async function getPaths () {
  return Object.keys(products).map(slug => {
    return { slug }
  })
}

export async function getData ({ slug }) {
  return products[slug]
}
</script>

<script>
import AddToCart from './_add-to-cart.svelte'
import { Hydrate } from '@jamcart/7ty/components'

export let credits
export let html
export let image
export let title
export let slug

const data = {
  id: slug,
  title
}
</script>

<svelte:head>
  <title>{ title }</title>
</svelte:head>

<Layout>
  <article>
    <h2>{ title }</h2>

    <figure>
      <img alt="" src={ image } height="828" width="640" />
      <figcaption>
        {@html credits}
      </figcaption>
    </figure>
  
    <div class="body">
      {@html html}
      <footer>
        <Hydrate component={ AddToCart } props={ data } />
      </footer>
    </div>
  </article>
</Layout>

<style>
article {
  display: grid;
  grid-template: "img title" 1.5em "img content" / 1fr minmax(25em, 50%);
  margin: 0 auto 3em;
  max-width: 100%;
  width: 70em;
}
figure {
  grid-area: img;
  padding: 0 1em;
  text-align: center;
}
figcaption {
  opacity: .6;
}
figcaption :global(a) {
  color: inherit;
}
h2 {
  grid-area: title;
  margin-top: 0;
}
.body {
  grid-area: content;
}

@media (max-width: 40em) {
  article {
    display: block;
  }
  figure {
    padding: 0;
  }
  footer {
    background: white;
    position: sticky;
    bottom: 0;
    padding: .5em;
  }
}
</style>
