// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// Rehype plugin to transform markdown images with alt text into figure + figcaption elements
const rehypeFigure = () => {
  return (tree) => {
    function visit(node) {
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i];
          if (child.type === 'element' && child.tagName === 'p' && child.children) {
            const nonWhitespace = child.children.filter(
              c => !(c.type === 'text' && /^\s*$/.test(c.value))
            );
            if (
              nonWhitespace.length === 1 &&
              nonWhitespace[0].type === 'element' &&
              nonWhitespace[0].tagName === 'img' &&
              nonWhitespace[0].properties &&
              nonWhitespace[0].properties.alt
            ) {
              const imgNode = nonWhitespace[0];
              const altText = imgNode.properties.alt;
              
              node.children[i] = {
                type: 'element',
                tagName: 'figure',
                properties: {},
                children: [
                  imgNode,
                  {
                    type: 'element',
                    tagName: 'figcaption',
                    properties: {},
                    children: [{ type: 'text', value: altText }]
                  }
                ]
              };
              continue;
            }
          }
          visit(child);
        }
      }
    }
    visit(tree);
  };
};

// https://astro.build/config
export default defineConfig({
  site: 'https://mangak.io.vn',
  markdown: {
    rehypePlugins: [rehypeFigure],
  },
  integrations: [
    mdx({
      rehypePlugins: [rehypeFigure],
    }),
    sitemap(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});