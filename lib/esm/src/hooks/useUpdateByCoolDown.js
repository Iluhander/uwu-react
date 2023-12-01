import { useRef } from 'react';
export default function useUpdateByCoolDown(setData, getDataIfChanged, onUpdate, coolDown = 1000) {
    const interval = useRef(null);
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
