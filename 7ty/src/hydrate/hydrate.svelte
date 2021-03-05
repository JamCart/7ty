<script>
import { randomBytes } from 'crypto'
import { hasContext, setContext } from 'svelte'
import createImport from './create-import'

let id = 'hydrate-' + randomBytes(5).toString('hex')
export let component
export let props = {}

let path

// Throw error if Hydrate components are nested inside each other
if (hasContext('_7ty_hydration')) {
  throw new Error('Hydratable components must not be nested')
}
setContext('_7ty_hydration')

// Throw error with no component
if (!component) {
  throw new Error('Missing component')
}

// Throw error if path is not in src directory
$: if (path && !path.startsWith('src/')) {
  throw new Error('Hydrated components must be located in the `src` directory')
}
</script>

<div { id }>
  <svelte:component this={ component } bind:_7ty_hydration={ path } { ...props } />
</div>
{@html createImport({ id, path, props })}
