import { IStatusObj } from '../../enums/types/types.js';

export interface IResponse<TResData> {
  data: TResData;
}

/**
 * Function, making the request.
 * 
 * Reject response schema: { response: { status: number } }
 */
export type TFetchFunction<TReqData, TResData> = (data?: TReqData) => Promise<IResponse<TResData>>;

export interface IReqConfig<TResData> {
  reducer?: (prevData: TResData | null, newData: TResData) => NonNullable<TResData> | null;
  getSuccessStatus?: (data: TResData) => number;
  getFailedStatus?: (errCode: number) => number;

  /**
   * Custom StatusObj, used instead of ReqStatus.
   */
  StatusObj?: IStatusObj;

  initialData?: TResData | null;

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

export interface IGetReqConfig<TResData> extends IReqConfig<TResData> {
  syncGuard?: () => TSyncGuardResult;
};

