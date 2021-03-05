export default function (md_dir) {
  const data = Object
    .values(md_dir)
    .map(md => {
      const slug = md.filename.replace(/\.md$/, "")
      return [
        slug,
        {
          html: md.html,
          slug,
          ...md.metadata
        }
      ]
    })

  return Object.fromEntries(data)
}
