/**
 * Injects data to form's input and select elements.
 * For each key in data searches for an input/select element with name = key.
 * @returns array of elements into which the injection was made.
 */
export default function injectFormData(form: HTMLFormElement | null, data: Record<string, any>): (HTMLInputElement | HTMLSelectElement)[] {
  if (!form) {
    return [];
  }

  const elements: (HTMLInputElement | HTMLSelectElement)[] = [];
  const elementsNames = Object.keys(data);
  for (let i = 0; i < elementsNames.length; ++i) {
    const correspondingElement = form.querySelector(`[name='${elementsNames[i]}']`) as HTMLInputElement | HTMLSelectElement | null;
    
    if (correspondingElement) {
      correspondingElement.value = data[elementsNames[i]];
      elements.push(correspondingElement);
    }
  }

  return elements;
}
