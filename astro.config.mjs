// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightUiTweaks from 'starlight-ui-tweaks'
import starlightBlog from 'starlight-blog'
import starlightSidebarSwipe from 'starlight-sidebar-swipe'
import starlightContextualMenu from "starlight-contextual-menu";
import mermaid from 'astro-mermaid';
import gruvbox from "starlight-theme-gruvbox";
import tailwindcss from '@tailwindcss/vite';

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [mermaid({
    theme:"forest",
    autoTheme:true
  }), starlight({
      title: 'Kieran\'s Components',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/descent098/components' }],
      sidebar: [
          {
              label: 'Standard',
              autogenerate:{directory:"standard"}
          },
          {
              label: 'Stack Specific',
              autogenerate: { directory: 'stacks' },
          },
      ],
		  customCss:["./src/styles/global.css"],
		  plugins:[
        starlightUiTweaks({
            navbarLinks: [
                { label: "Standard", href: "/standard" },
                { label: "Stacks", href: "/stacks" },
                { label: "Blog", href: "/blog" },
            ],
        }),
  starlightBlog({
        authors: {
            kieran: {
                name:"kieran",
                title:"descent098",
                url:"https://github.com/descent098",
                picture:"src/assets/profile-pic.webp"
            },
        },
        }),
		// Enables swiping in the menu from the side on moble
        starlightSidebarSwipe(), 

        // Enables view-as and copy-page options
        starlightContextualMenu({
            actions: ["copy", "view", "chatgpt", "claude"]
        }),
        //@ts-ignore
        gruvbox(),
		  ]

		}), svelte()],

  vite: {
    plugins: [tailwindcss()],
  },
});