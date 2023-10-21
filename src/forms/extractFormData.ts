export default function extractFormData<T = any>(form?: HTMLFormElement | null): T | null {
  if (!form) {
    return null;
  }

  const formData = new FormData(form);

  const res: any = {};
  formData.forEach((value, key) => (res[key] = value));

  return res as T;
}
