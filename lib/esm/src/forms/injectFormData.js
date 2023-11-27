/**
 * Injects data to form's input and select elements.
 * For each key in data searches for an input/select element with name = key.
 * @returns array of elements into which the injection was made.
 */
export default function injectFormData(form, data) {
    if (!form) {
        return [];
    }
    const elements = [];
    const elementsNames = Object.keys(data);
    for (let i = 0; i < elementsNames.length; ++i) {
        const correspondingElement = form.querySelector(`[name='${elementsNames[i]}']`);
        if (correspondingElement) {
            correspondingElement.value = data[elementsNames[i]];
            elements.push(correspondingElement);
        }
    }
    return elements;
}
