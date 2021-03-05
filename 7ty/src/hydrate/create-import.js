import devalue from 'devalue'
import { HYDRATION_VAR } from './preprocess'

export default function ({ id, path, props}) {
  // FIXME: How does this even get here?
  delete props[HYDRATION_VAR]

  // TODO: Catch devalue's errors and make them more readable
  return `
<script data-hydrate="true"
  data-import="${ path }"
  data-target="${ id }">${ devalue(props) }</script>
`
}
