import { IStatusObj } from '../../enums/types/types.js';
export type TFetchFunction = (data: any) => Promise<any>;
export interface IReqConfig<T> {
    getSuccessStatus?: (data: T) => number;
    getFailedStatus?: (errCode: number) => number;
    StatusObj?: IStatusObj;
    initialData?: T | null;
    notInstantReq?: boolean;
}
export type TSyncGuardResult = number | undefined;
export interface IGetReqConfig<T> extends IReqConfig<T> {
    syncGuard?: () => TSyncGuardResult;
}
//# sourceMappingURL=types.d.ts.map