export default function extractFormData(form) {
    if (!form) {
        return null;
    }
    const formData = new FormData(form);
    const res = {};
    formData.forEach((value, key) => (res[key] = value));
    return res;
}
