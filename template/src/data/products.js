import products from './products/*.md'

const products_by_slug = Object.fromEntries(Object.values(products).map(product => {
  return [
    product.metadata.slug,
    {
      html: product.html,
      ...product.metadata
    }
  ]
}))

export default products_by_slug
