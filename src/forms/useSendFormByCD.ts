import useUpdateByCoolDown from '../hooks/useUpdateByCoolDown.js';
import areEqualShallow from '../objs/areEqualShallow.js';
import useReq from '../hooks/useReq/useReq.js';
import extractFormData from './extractFormData.js';
import { TFetchFunction } from '../hooks/types/types.js';
import { RefObject } from 'react';
import { ISendFormByCDConfig } from './types/types.js';

export default function useSendFormByCD<T>(fetchFunction: TFetchFunction, formRef: RefObject<HTMLFormElement>, config: ISendFormByCDConfig<T> = {}) {
  const beforeSending = config.beforeSending || ((newData: any) => newData);
  const compare =
    config.compare || ((prevData, newData) => newData && !areEqualShallow(prevData, newData));

  const { status, exec, setReqData } = useReq<T, T>((data: T) => fetchFunction(data), {
    notInstantReq: true,
    initialData: extractFormData<T>(formRef?.current)
  });

  useUpdateByCoolDown(
    setReqData,
    (prevData: T) => {
      const newData = extractFormData<T>(formRef.current);

      if (compare(prevData, newData)) {
        return beforeSending(newData);
      }
    },
    exec,
    2500
  );

  return status;
}
