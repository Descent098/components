<script>
    import SimpleCodeEditor from "./simpleCodeEditor.ts.svelte";
    import { css } from "@codemirror/lang-css";
    import { javascript } from "@codemirror/lang-javascript";

    let {
        backgroundColor = "#141414",
        separateTabs = true,
        htmlData = [""],
        cssData = [""],
        jsData = [""],
    } = $props();

    let preview = $state("");
    let show = $state("htmlContent");
    const uid = Math.random().toString(36).slice(2);

    $effect(() => {
        if (!Array.isArray(htmlData)) {
            throw new Error(
                "Cannot render editor invalid, htmlData must be a list of strings not a string",
            );
        }
        if (!Array.isArray(cssData)) {
            throw new Error(
                "Cannot render editor invalid, cssData must be a list of strings not a string",
            );
        }
        if (!Array.isArray(jsData)) {
            throw new Error(
                "Cannot render editor invalid, jsData must be a list of strings not a string",
            );
        }
        if (separateTabs) {
            const template =
                `${htmlData[0]}\n<style>${cssData[0]}</style>\n<script>${jsData[0]}` +
                "<\\script>".replace("\\", "/");
            preview = template;
        } else {
            preview = htmlData[0];
        }
    });
</script>

{#if separateTabs}
    <div class="tabs">
        <!-- Tab buttons -->
        <input
            type="radio"
            name={"tabs-" + uid}
            id={"html-" + uid}
            bind:group={show}
            value="htmlContent"
            checked
        />
        <label
            class="tab-label"
            for={"html-" + uid}
            style={`background: color-mix(in srgb, ${backgroundColor}, white 15%); border: 1px solid color-mix(in srgb, ${backgroundColor}, white 15%); color:  color-mix(in srgb, ${backgroundColor}, white 60%);`}
            >HTML</label
        >

        <input
            type="radio"
            name={"tabs-" + uid}
            id={"css-" + uid}
            bind:group={show}
            value="cssContent"
        />
        <label
            class="tab-label"
            for={"css-" + uid}
            style={`background: color-mix(in srgb, ${backgroundColor}, white 15%); border: 1px solid color-mix(in srgb, ${backgroundColor}, white 15%); color:  color-mix(in srgb, ${backgroundColor}, white 60%);`}
            >CSS</label
        >

        <input
            type="radio"
            name={"tabs-" + uid}
            id={"js-" + uid}
            bind:group={show}
            value="jsContent"
        />
        <label
            class="tab-label"
            for={"js-" + uid}
            style={`background: color-mix(in srgb, ${backgroundColor}, white 15%); border: 1px solid color-mix(in srgb, ${backgroundColor}, white 15%); color:  color-mix(in srgb, ${backgroundColor}, white 60%);`}
            >JS</label
        >

        <!-- Tab contents -->
        <div
            class="tab-content"
            style={`background: ${backgroundColor}; border: 1px solid color-mix(in srgb, ${backgroundColor}, white 15%);display:${show == "htmlContent" ? "block" : "none"};`}
        >
            <SimpleCodeEditor
                fileTitle=""
                contentStore={htmlData}
                initialData={htmlData[0]}
            />
        </div>

        <div
            class="tab-content"
            style={`background: ${backgroundColor}; border: 1px solid color-mix(in srgb, ${backgroundColor}, white 15%);display:${show == "cssContent" ? "block" : "none"};`}
        >
            <SimpleCodeEditor
                fileTitle=""
                language={css}
                initialData={cssData[0] ? cssData[0] : ""}
                contentStore={cssData}
                emmetAbreviationsLanguage={undefined}
            />
        </div>

        <div
            class="tab-content"
            style={`background: ${backgroundColor}; border: 1px solid color-mix(in srgb, ${backgroundColor}, white 15%);display:${show == "jsContent" ? "block" : "none"};`}
        >
            <SimpleCodeEditor
                fileTitle=""
                language={javascript}
                initialData={jsData[0] ? jsData[0] : ""}
                contentStore={jsData}
                emmetAbreviationsLanguage={undefined}
            />
        </div>
    </div>
{:else}
    <SimpleCodeEditor
        fileTitle="HTML"
        contentStore={htmlData}
        initialData={htmlData[0] ? htmlData[0] : ""}
    />
{/if}

<h2>Preview</h2>
<iframe
    srcdoc={preview}
    frameborder="0"
    title="asdsad"
    style={`border: 1px solid color-mix(in srgb, ${backgroundColor}, white 15%);background:white; unset:all;padding:0;margin:0;`}
></iframe>

<style>
    .tabs input[type="radio"] {
        display: none;
    }

    .tab-label {
        display: inline-block;
        padding: 10px 25px;
        margin-right: 2px;
        border-radius: 5px 5px 0 0;
        cursor: pointer;
        transition: all 0.3s ease;
        user-select: none;
        border-bottom: 1px solid transparent;
    }

    .tabs input[type="radio"]:checked + .tab-label {
        font-weight: bold;
        position: relative;
        z-index: 2;
    }

    .tab-content {
        /* display: none; */
        padding: 20px;
        border-radius: 0 5px 5px 5px;
        margin-top: -1px;
        animation: fadeIn 0.2s ease-in-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateX(5px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    iframe {
        width: 100%;
        min-height: 30vh;
        overflow-y: auto;
        resize: vertical;
        overflow: auto;
        border-radius: 0.25rem;
    }
</style>
