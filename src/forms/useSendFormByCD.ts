import { RefObject, useEffect } from 'react';
import useUpdateByCoolDown from '../hooks/useUpdateByCoolDown.js';
import areEqualShallow from '../objs/areEqualShallow.js';
import useReq from '../hooks/useReq/useReq.js';
import extractFormData from './extractFormData.js';
import { TFetchFunction } from '../hooks/types/types.js';
import { ISendFormByCDConfig } from './types/types.js';
import injectFormData from './injectFormData.js';

/**
 * Makes requests with form data by cool down.
 * @param fetchFunction - called by cool down.
 * @param formRef - reference to form.
 * @param config - config.
 */
export default function useSendFormByCD<T>(fetchFunction: TFetchFunction, formRef: RefObject<HTMLFormElement>, config: ISendFormByCDConfig<T> = {}) {
  const beforeSending = config.beforeSending || ((newData: any) => newData);
  const compare =
    config.compare || ((prevData, newData) => newData && !areEqualShallow(prevData, newData));
  const coolDown = config.coolDown || 5000;
  const name = config.name;

  useEffect(() => {
    if (!name || !formRef.current) {
      return;
    }

    // Retrieving data from local storage.
    const recovered = localStorage.getItem(name);
    if (recovered && formRef.current) {
      injectFormData(formRef.current, JSON.parse(recovered));
    }

    // Saving data to local storage.
    setInterval(() => {
      if (formRef.current) {
        localStorage.setItem(name, JSON.stringify(extractFormData<T>(formRef.current) || {}));
      }
    }, config.localSavingCoolDown || 2000);
  }, [formRef?.current, name]);

  const { status, exec, setReqData } = useReq<T>((data: T) => fetchFunction(data), {
    notInstantReq: true,
    initialData: extractFormData<T>(formRef?.current)
  });
  
  const { stopUpdating, restartUpdating } = useUpdateByCoolDown(
    setReqData,
    (prevData: T) => {
      const newData = extractFormData<T>(formRef.current);

      if (compare(prevData, newData)) {
        return beforeSending(newData);
      }
    },
    exec,
    coolDown
  );

  return {
    status,
    stopUpdating, 
    restartUpdating,
    forceUpdate: () => exec(beforeSending(extractFormData<T>(formRef.current)))
  };
}
