# 7ty

7ty is a Static Site Generator that uses Svelte for templating.

## Requirements

* Node 14

## Installation

`npm init @jamcart/7ty new-folder`

## Project File Structure

* `rollup.config.mjs` This must export two functions, `client` and `server`, that return Rollup's configuration.
* `public/` Final output of 7ty's build process.  You don't need to create this.
* `src/routes/` Your entrypoints should live here.  See "Routing" for more details.
* `src/template.html` A basic HTML template.
* `static/` All files in this folder and directly copied, as is, to the output folder.

## Routing

Each `*.svelte` file located inside of `src/routes` is executed, its output placed inside the shell provided by `src/template.html`, and then written to `public` with the file extension replaced by `.html`.  Any file or directory whose name begins with an `_` will be ignored.  This pattern was modeled after Sapper's route handling.

For further example, the file `src/routes/about/index.svelte` will be written out to `public/about/index.html`.  The file `src/routes/_private/stuff.svelte` will not create an output file.

Entrypoints should *not* rely on promises as Svelte's SSR does not support those.  If you need to asynchronously fetch data, see `getData` below. 

### getData

Becuase Svelte's SSR does not handle promises at all, any data fetching must occur before the component is initialized.  If exported, `getData` will be called and the returned object will be passed as props when initializing your component.  If `getPaths` is present, the object returned by `getPaths` will be passed to `getData`.

`getData` should be defined in a context="module" script since it is not part of the component instance itself – it runs before the component has been created.

### getPaths

A single entrypoint can be responsible for multiple files in the output.  If defined, `getPaths` is expected to return an array of objects.  Each object will generate one new page.  Any part of the filename using `[brackets]` is assumed to be dynamic and will be replaced with the corresponding key.

The following example will produce two files: `public/blog/bats.html` and `public/blog/bees.html`

```html
// src/routes/blog/[slug].svelte
<script context="module">
export async getPaths() {
  return [
    { slug: "bats", id: 3 },
    { slug: "bees", id: 5 }
  ]
}

export async getData({ slug, id }) {
  const { name, area } = await getData(id)
  return {
    area,
    name
  }
}
</script>

<script>
export let area
export let name
</script>

<p>{ name } live in { area }.</p>
```

## Partial Hydration

`import { Hydrate } from '@jamcart/7ty/components`

A Svelte component is exposed to handle partial hydration.  It takes two parameters:

* `component` The Svelte component to render.  This must be the actual component, *not* an import path.  The component must have a non-empty `<script>` tag and be located inside the `src/` or otherwise it will not be picked up in the required step of preprocessing.
* `props` An object to pass to the component as props on initialization.  It must be `JSON.stringify`able.


```html
<script>
import { Hydrate } from '@jamcart/7ty/components`
import Counter from './_counter.svelte'
</script>

<h1>My Counter</h1>
<Hydrate component={ Counter } props={{ startValue: 10 }} />
```
