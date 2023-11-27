import useUpdateByCoolDown from '../hooks/useUpdateByCoolDown.js';
import areEqualShallow from '../objs/areEqualShallow.js';
import useReq from '../hooks/useReq/useReq.js';
import extractFormData from './extractFormData.js';
import { useEffect } from 'react';
import injectFormData from './injectFormData.js';
/**
 * Makes requests with form data by cool down.
 * @param fetchFunction - called by cool down.
 * @param formRef - reference to form.
 * @param config - config.
 */
export default function useSendFormByCD(fetchFunction, formRef, config = {}) {
    const beforeSending = config.beforeSending || ((newData) => newData);
    const compare = config.compare || ((prevData, newData) => newData && !areEqualShallow(prevData, newData));
    const coolDown = config.coolDown || 5000;
    const name = config.name;
    // Retrieving data from local storage.
    useEffect(() => {
        if (!name || !formRef.current) {
            return;
        }
        const recovered = localStorage.getItem(name);
        if (recovered && formRef.current) {
            injectFormData(formRef.current, JSON.parse(recovered));
        }
        // Saving data to local storage.
        setInterval(() => {
            if (formRef.current) {
                localStorage.setItem(name, JSON.stringify(extractFormData(formRef.current) || {}));
            }
        }, config.localSavingCoolDown || 2000);
    }, []);
    const { status, exec, setReqData } = useReq((data) => fetchFunction(data), {
        notInstantReq: true,
        initialData: extractFormData(formRef?.current)
    });
    useUpdateByCoolDown(setReqData, (prevData) => {
        const newData = extractFormData(formRef.current);
        if (compare(prevData, newData)) {
            return beforeSending(newData);
        }
    }, exec, coolDown);
    return status;
}
