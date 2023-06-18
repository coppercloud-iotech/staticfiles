class Widget extends HTMLElement {
    connectedCallback() {
        const id = this.attributes[0].value;
        const originalSrc = this.attributes[1].value;
        const alt = this.attributes[2].value;

        // Create a new image element
        const img = document.createElement('img');
        img.draggable = true;
        img.setAttribute('ondragstart', 'drag(event)');
        img.id = id;
        img.src = originalSrc;
        img.alt = alt;

        // Create a wrapper div for the image
        const wrapper = document.createElement('div');
        wrapper.classList.add('elements');
        wrapper.appendChild(img);

        // Append the wrapper div to the custom element
        this.appendChild(wrapper);
    }
}

customElements.define("again-widget", Widget);
