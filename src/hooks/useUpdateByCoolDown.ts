import { Dispatch, SetStateAction, useRef } from 'react';

type TInterval = {
  stopped: boolean;
  val: any;
}

const trySetInterval = (interval: { current: TInterval}, tryUpdate: () => void, coolDown: number) => {
  if (!interval.current.stopped && interval.current.val === -1) {
    interval.current.val = setInterval(tryUpdate, coolDown);
  }
}

export default function useUpdateByCoolDown<T>(
  setData: Dispatch<SetStateAction<T>>,
  getDataIfChanged: (prevData: T) => T | undefined,
  onUpdate: (data: T) => void,
  coolDown = 1000
) {
  const interval = useRef<TInterval>({
    stopped: false,
    val: -1
  });

  const tryUpdate = () => setData((prevData) => {
    const newData = getDataIfChanged(prevData);

    if (newData !== undefined) {
      setTimeout(() => onUpdate(newData), 0);
      return newData;
    }

    return prevData;
  });

  trySetInterval(interval, tryUpdate, coolDown);

  return {
    stopUpdating: () => {
      interval.current.stopped = true;
      clearInterval(interval.current.val);
    },
    restartUpdating: () => {
      interval.current.stopped = false;
      interval.current.val = -1;
      
      trySetInterval(interval, tryUpdate, coolDown);
    }
  }
}
