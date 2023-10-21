import { IStatusObj } from "./types/types.js";

/**
 * Base request state enum.
 */
const obj : IStatusObj = {
  LOADING: 0,
  INITIALIZED: 1,
  LOADED: 200,
  ERROR: 400
};

export default obj;
