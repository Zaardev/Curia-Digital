const contentful = require("contentful");

module.exports = async function () {
  const client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });

  const entries = await client.getEntries({ content_type: "blogPost" });

  return {
    posts: entries.items.map((item) => ({
      title: item.fields.title,
      date: item.fields.date,
      slug: item.fields.slug,
      body: item.fields.body,
    })),
  };
};
