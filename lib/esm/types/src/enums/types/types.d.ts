export interface IStatusObj {
    /**
     * No requests will be made until the exec call.
     */
    INITIALIZED: number;
    /**
     * Request is currenly processing.
     */
    LOADING: number;
    /**
     * A request has successfully finished.
     */
    LOADED: number;
    /**
     * A request has finished with a general error.
     */
    ERROR: number;
    /**
     * A request has finished with a timeout error.
     */
    TIMEOUT: number;
}
//# sourceMappingURL=types.d.ts.map