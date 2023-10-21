import { Dispatch, SetStateAction, useRef } from 'react';

export default function useUpdateByCoolDown<T>(
  setData: Dispatch<SetStateAction<T>>,
  getDataIfChanged: (prevData: T) => T | undefined,
  onUpdate: (data: T) => void,
  coolDown = 1000
) {
  const interval = useRef<null | NodeJS.Timeout>(null);

  if (!interval.current) {
    interval.current = setInterval(() => {
      setData((prevData) => {
        const newData = getDataIfChanged(prevData);

        if (newData !== undefined) {
          setTimeout(() => onUpdate(newData), 0);
          return newData;
        }

        return prevData;
      });
    }, coolDown);
  }

  return interval.current;
}
