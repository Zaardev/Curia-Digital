const contentful = require("contentful");

module.exports = async function() {
  const client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ENV === "preview"
      ? process.env.CONTENTFUL_PREVIEW_TOKEN
      : process.env.CONTENTFUL_DELIVERY_TOKEN
  });

  try {
    const entries = await client.getEntries({
      content_type: process.env.CONTENTFUL_TYPE_ID
    });

    const seenSlugs = new Set();

    const posts = entries.items.map(item => {
      let slug = item.fields.slug || item.fields.title.toLowerCase().replace(/\s+/g, "-");

      if (seenSlugs.has(slug)) {
        slug = `${slug}-${item.sys.id}`;
      }
      seenSlugs.add(slug);

      return {
        title: item.fields.title,
        date: item.fields.date,
        slug: slug,
        body: item.fields.body,
        permalink: `/blog/${slug}/index.html`
      };
    });

    return { posts }; // <-- now blog.njk can access contentful.posts
  } catch (error) {
    console.error("❌ Contentful fetch failed:", error);
    return { posts: [] };
  }
};
