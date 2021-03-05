<script>
import './style.css'
import { Hydrate } from '7ty/components'
import SavedItems from './_saved-items.svelte'
</script>

<main>
  <header>
    <h1>
      <a href="/">
        <img alt="" src="/favicon.png" />
        7ty Demo
      </a>
    </h1>
    <Hydrate component={ SavedItems } />
  </header>

  <slot></slot>
</main>

<style>
main {
  font-family: sans-serif;
  font-size: 100%;
}
a {
  color: inherit;
  text-decoration: none;
}
h1 {
  font-size: 175%;
}
header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 45em;
}
img {
  vertical-align: middle;
}
</style>
