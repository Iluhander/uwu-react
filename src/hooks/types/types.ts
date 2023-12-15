import { IStatusObj } from '../../enums/types/types.js';

export interface IResponse {
  data: any;
}

/**
 * Function, making the request.
 * 
 * Reject response schema: { response: { status: number } }
 */
export type TFetchFunction = (data: any) => Promise<IResponse>;

export interface IReqConfig<T> {
  reducer?: (prevData: T | null, newData: T) => NonNullable<T> | null;
  getSuccessStatus?: (data: T) => number;
  getFailedStatus?: (errCode: number) => number;

  /**
   * Custom StatusObj, used instead of ReqStatus.
   */
  StatusObj?: IStatusObj;

  initialData?: T | null;

  /**
   * Will the request be made right after hook initialization.
   */
  notInstantReq?: boolean;

  /**
   * Request timeout in ms. If time run out, sets status to IStatusObj.TIMEOUT. Defaults to 30s.
   */
  timeout?: number;

  /**
   * Amount of times the request can be attempted to execute (including attempts after an error).
   * Defaults to 1.
   */
  attempts?: number;
  ResSchema?: { new(): any };
};

export type TSyncGuardResult = number | undefined;

export interface IGetReqConfig<T> extends IReqConfig<T> {
  syncGuard?: () => TSyncGuardResult;
};

