eleventyConfig.addCollection("posts", () => {
  const seen = new Set();
  return entries.items.map(item => {
    let slug = item.fields.slug;

    if (seen.has(slug)) {
      throw new Error(`Duplicate slug detected: ${slug}`);
    }
    seen.add(slug);

    return {
      title: item.fields.title,
      date: item.fields.date,
      slug,
      body: item.fields.body,
      permalink: `/blog/${slug}/index.html`
    };
  });
});
