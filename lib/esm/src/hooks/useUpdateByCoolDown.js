import { useRef } from 'react';
const trySetInterval = (interval, tryUpdate, coolDown) => {
    if (!interval.current.stopped && interval.current.val === -1) {
        interval.current.val = setInterval(tryUpdate, coolDown);
    }
};
export default function useUpdateByCoolDown(setData, getDataIfChanged, onUpdate, coolDown = 1000) {
    const interval = useRef({
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
    };
}
