import normalizePath from '../util/normalize-path.js'

export const HYDRATION_VAR = '_7ty_hydration'

export default {
  // FIXME: This doesn't work at all if component has no <script> tag
  script  ({ content, filename }) {
    const full_path = normalizePath(filename)
    if (full_path.startsWith('src/')) {
      // FIXME: This is messing up source maps
      const code = `export const ${ HYDRATION_VAR } = '${ full_path }'\n${ content }`
      return { code }
    }
  }  
}
