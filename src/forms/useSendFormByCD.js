import useUpdateByCoolDown from '../hooks/useUpdateByCoolDown';
import areEqualShallow from '../objs/areEqualShallow';
import useReq from '../hooks/useReq/useReq';
import extractFormData from './extractFormData';

export default function useSendFormByCD(fetchFunction, formRef, config = {}) {
  const beforeSending = config.beforeSending || ((newData) => newData);
  const compare =
    config.compare || ((prevData, newData) => newData && !areEqualShallow(prevData, newData));

  const { status, exec, setReqData } = useReq((data) => fetchFunction(data), {
    notInstantReq: true,
    initialData: extractFormData(formRef?.current)
  });

  useUpdateByCoolDown(
    setReqData,
    (prevData) => {
      const newData = extractFormData(formRef.current);

      if (compare(prevData, newData)) {
        return beforeSending(newData);
      }
    },
    exec,
    2500
  );

  return status;
}
