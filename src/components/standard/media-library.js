/**
 * @typedef MediaData
 * @property {string} title
 * @property {string} description
 * @property {string} image
 * @property {string | undefined} link
*/


class MediaLibrary extends HTMLElement {
    /**@type {MediaData[]} */
    _data
    /**@type {Boolean} */
    _initiallyGreyscale
    /**@type {string}*/
    _aspectRatio

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        /**@type {MediaData[]} */
        this._data = [];
        this._initiallyGreyscale = true
        this._aspectRatio = "8/12"
    }

    static get observedAttributes() {
        // WARNING all attributes arrive lowercase, DO NOT make your attributes camelCase
        return ['data', "initiallygreyscale", "aspectratio"];
    }

    /**
     * Function called when an attribute is changed
     * @param {string } name The name of the attribute that changed
     * @param {any} oldValue the old value (unused)
     * @param {any} newValue The new value (unused)
     */
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "data":
                try {
                    this._data = JSON.parse(newValue);
                } catch (e) {
                    console.error('Invalid JSON:', e);
                    this._data = [];
                }
                break
            case "initiallygreyscale":
                if (typeof newValue === "string") {
                    if (newValue == "true") {
                        this._initiallyGreyscale = true
                    } else {
                        this._initiallyGreyscale = false
                    }
                } else if (typeof newValue === "boolean") {
                    this._initiallyGreyscale = newValue
                } else {
                    console.error(`Cannot set initiallygreyscale to a non-boolean value, got type ${typeof newValue} and value ${newValue}`)
                }
                break
            case "aspectratio":
                if (newValue.includes("/")) {
                    this._aspectRatio = newValue
                } else {
                    if (newValue == "1") {
                        this._aspectRatio = "1"
                    } else {
                        console.error(`Cannot set aspect ratio to an invalid value, should be a string like "1", "9/12", etc. got type ${typeof newValue} and value ${newValue}`)
                    }
                }

                break
        }
        this.render();
    }

    set data(value) {
        if (typeof value === "string") {
            value = JSON.parse(value)
        }
        this._data = value;
        this.render();
    }

    get data() {
        return this._data;
    }

    get initiallygreyscale() {
        return this._initiallyGreyscale
    }

    get aspectratio() {
        return this._aspectRatio
    }

    set aspectratio(value) {
        if (value.includes("/")) {
            this._aspectRatio = value
        } else {
            if (value == "1") {
                this._aspectRatio = "1"
            } else {
                console.error(`Cannot set aspect ratio to an invalid value, should be a string like "1", "9/12", etc. got type ${typeof value} and value ${value}`)
            }
        }
    }

    set initiallygreyscale(value) {
        if (typeof value === "string") {
            if (value == "true") {
                value = true
            } else {
                value = false
            }
            this._initiallyGreyscale = value
        } else if (typeof value === "boolean") {
            value = value
            this._initiallyGreyscale = value
        } else {
            console.error(`Cannot set initiallyGreyscale to a non-boolean value, got type ${typeof value} and value ${value}`)
        }
        this.render()

    }

    render() {
        const styles = `
    <style>
        .library{
            width:98%;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            column-gap:.25rem;
            row-gap:1.25rem;
            padding:6px;
            overflow:hidden;
            justify-items: center;
        }
        .item{
            height:30vh;
            border-radius: .5rem;
            transition:all 100ms ease-in-out;
            aspect-ratio: ${this._aspectRatio};
        }
        .item .details{
            display: none; /* Initially Hidden*/
        }



        .item:hover .details{
            display: inline-block;
            position: absolute;
            color:white;
            padding:1.25rem;
            z-index: 5;
            width:100%;
        }

        .item:hover .details .details-link{
            display: inline-block;
            position: absolute;
            color:white;
            z-index: 5;
            color:currentColor;
            text-decoration:none;
            width:100%;
        }
        .item img{
            width:100%;
            height:100%;
            object-fit: cover;
            border-radius: .5rem;
            ${this._initiallyGreyscale ? "filter:grayscale()" : ""}
        }
        .item:hover img{
            filter: brightness(0.5);
        }
        .item:hover{
            scale: 102%;
            box-shadow: 5px 5px 5px #00000033;
        }
    </style>
    `;

        const items = this._data.map(entry => `
    <div class="item">
        
        <div class="details">
        ${entry.link ? `<a class="details-link" href="${entry.link}">` : ""}
        <h2>${entry.title}</h2>
        <p>${entry.description}</p>
        ${entry.link ? `</a>` : ""}
        </div>
        <img src="${entry.image}" alt="${entry.title}">
        
    </div>
    `).join('');

        //@ts-ignore
        this.shadowRoot.innerHTML = `${styles}<div class="library">${items}</div>`;
    }

    connectedCallback() {
        if (this._data.length) {
            this.render();
        } else {
            throw new Error("No data was provided to <media-library>, cannot render")
        }
    }
}

customElements.define('media-library', MediaLibrary);
