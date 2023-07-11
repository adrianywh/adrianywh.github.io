import { defineConfig } from "tinacms"


// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";


export default defineConfig({
  branch,
  clientId: null, // Get this from tina.io
  token: null, // Get this from tina.io


  build: {
    outputFolder: "admin",
    publicFolder: "docs",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "docs",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "posts",
        defaultItem: () => {
          return {
            // When a new post is created the tags field will be set to "post"
            tags: 'post',
            layout: "page.html"
          }
        },
        fields: [
          {
            type: "string",
            name: "tags",
            label: "Tags",
            required: true,
          },
          {
            type: "string",
            name: "layout",
            label: "Layout",
            required: true,
            placeholder: "Please use page.html"
          },
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Post date",
            ui: {
              timeFormat: "HH:mm"
            },
          }
        ],
      },
    ],
  },
});
