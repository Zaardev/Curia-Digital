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

    return entries.items.map(item => ({
      title: item.fields.title,
      date: item.fields.date,
      slug: item.fields.slug,
      body: item.fields.body,
      permalink: `/blog/${item.fields.slug}/index.html`
    }));
  } catch (error) {
    console.error("❌ Contentful fetch failed:", error);
    return [];
  }
};
