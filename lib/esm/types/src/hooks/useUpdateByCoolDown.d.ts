/// <reference types="node" resolution-mode="require"/>
import { Dispatch, SetStateAction } from 'react';
export default function useUpdateByCoolDown<T>(setData: Dispatch<SetStateAction<T>>, getDataIfChanged: (prevData: T) => T | undefined, onUpdate: (data: T) => void, coolDown?: number): NodeJS.Timeout;
//# sourceMappingURL=useUpdateByCoolDown.d.ts.map