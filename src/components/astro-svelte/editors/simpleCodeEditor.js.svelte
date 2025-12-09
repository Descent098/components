<script>
    import { onMount } from "svelte";
    import { EditorView, basicSetup } from "codemirror";
    import { html } from "@codemirror/lang-html";
    import { gruvboxDark } from "@uiw/codemirror-theme-gruvbox-dark";
    import {abbreviationTracker} from "@emmetio/codemirror6-plugin";

    let view;
    let containerElement;
    let {
        theme = gruvboxDark,
        fileTitle = "",
        language = html,
        initialData = "<h1>Hello World</h1>",
        emmetAbreviationsLanguage = "html",
        contentStore = $bindable(undefined),
    } = $props();

    onMount(() => {
        // Create shadow root to isolate styles
        const shadow = containerElement.attachShadow({ mode: "open" });
        const wrapper = document.createElement("div");
        wrapper.style.height = "100%";
        shadow.appendChild(wrapper);

        // Build Editor into wrapper
        view = new EditorView({
            parent: wrapper,
            doc: initialData,
            extensions: [
                basicSetup,
                language(),
                theme,
                abbreviationTracker({
                    syntax: emmetAbreviationsLanguage,
                }),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        if (contentStore != undefined) {
                            //   console.log("in, updated DOc", contentStore, view.state.doc.toString())
                            if (contentStore.length == 0) {
                                contentStore.push(view.state.doc.toString());
                            } else {
                                contentStore[0] = view.state.doc.toString();
                            }
                        }
                    }
                }),
            ],
        });
        if (contentStore != undefined) {
            //   console.log("in, updated DOc", contentStore, view.state.doc.toString())
            if (contentStore.length == 0) {
                contentStore.push(view.state.doc.toString());
            } else {
                contentStore[0] = view.state.doc.toString();
            }
        }
    });
</script>

<div id="code-container">
    {#if fileTitle}
    <h2>{fileTitle}</h2>
    {/if}
    <div bind:this={containerElement}></div>
</div>

<style>
    #code-container {
        display: flex;
        flex-direction: column;
    }
    h2 {
        font-size: 1.3rem;
    }
</style>
