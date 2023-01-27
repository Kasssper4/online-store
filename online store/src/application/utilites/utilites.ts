export function createDocElement(tag: string, className: string, text?: string) {
    const el = document.createElement(tag);
    el.className = className;
    if (text) {
        el.innerText = text;
    }
    return el;
}
