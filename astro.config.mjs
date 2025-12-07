// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightUiTweaks from 'starlight-ui-tweaks'
import starlightBlog from 'starlight-blog'
import starlightSidebarTopics from 'starlight-sidebar-topics'
import starlightSidebarSwipe from 'starlight-sidebar-swipe'
import starlightContextualMenu from "starlight-contextual-menu";
import mermaid from 'astro-mermaid';
import gruvbox from "starlight-theme-gruvbox";
import tailwindcss from '@tailwindcss/vite';

import svelte from "@astrojs/svelte";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
    base: "/components",
    site:"https://kieranwood.ca",
    integrations: [mermaid({
        theme: "forest",
        autoTheme: true
    }), starlight({
        title: 'Kieran\'s Components',
        social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/descent098/components' }],
        customCss: ["./src/styles/global.css"],
        plugins: [
            starlightUiTweaks({
                navbarLinks: [
                    { label: "Standard", href: "/components/standard" },
                    { label: "Stacks", href: "/components/stacks" },
                    { label: "Utilities", href: "/components/utilities" },
                    { label: "Blog", href: "/components/blog" },
                ],
            }),
            starlightSidebarTopics([
                // Overview links
                {
                    label: "Standard",
                    link: "/standard",
                    icon: "seti:html",
                    items: [
                        {
                            label: 'Gettting started',
                            autogenerate: { directory: "standard" },
                        },
                    ],

                },


                {
                    label: "Stack Specific",
                    link: "/stacks",
                    icon: "seti:npm",
                    items: [
                        {
                            label: "Overview",
                            items: ["stacks"],
                        },

                        {
                            label: 'Astro Tailwind/Daisy',
                            autogenerate: { directory: 'stacks/astro-daisy' },
                        },
                        {
                            label: 'Astro Svelte',
                            autogenerate: { directory: 'stacks/astro-svelte' },
                        },
                        {
                            label: 'React Tailwind',
                            autogenerate: { directory: 'stacks/react-tailwind' },
                        },
                    ],

                },


                {
                    label: "Utilities",
                    link: "/utilities",
                    icon: "seti:javascript",
                    items: [
                        {
                            label: 'Overview',
                            autogenerate: { directory: 'utilities' },
                        }
                    ],

                },
                {
                    label: "Blog",
                    link: "/blog",
                    icon: "open-book",
                    items: [],
                    id: 'blog', // make the blog plugin play nice with the sidebar
                },
            ],

                {
                    topics: {
                        // make the blog plugin play nice with the sidebar
                        blog: ['/blog', '/blog/**/*'],
                    },
                },
            ), // end of sidebar config
            starlightBlog({
                authors: {
                    kieran: {
                        name: "kieran",
                        title: "descent098",
                        url: "https://github.com/descent098",
                        picture: "src/assets/profile-pic.webp"
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

        ],
        components: {
            // Override the default `Sidebar` component with a custom one.
            Sidebar: '/src/components/internal/Sidebar.astro',
            PageTitle:"/src/components/internal/PageTitle.astro",
        },

    }), svelte(), react()],

    vite: {
        plugins: [tailwindcss()],
    },
});