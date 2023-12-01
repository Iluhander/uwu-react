import { IStatusObj } from '../../enums/types/types.js';
export interface IResponse {
    data: any;
}
export type TFetchFunction = (data: any) => Promise<IResponse>;
export interface IReqConfig<T> {
    reducer?: (prevData: T | null, newData: T) => NonNullable<T> | null;
    getSuccessStatus?: (data: T) => number;
    getFailedStatus?: (errCode: number) => number;
    StatusObj?: IStatusObj;
    initialData?: T | null;
    notInstantReq?: boolean;
    ResSchema?: {
        new (): any;
    };
}
export type TSyncGuardResult = number | undefined;
export interface IGetReqConfig<T> extends IReqConfig<T> {
    syncGuard?: () => TSyncGuardResult;
}
//# sourceMappingURL=types.d.ts.map