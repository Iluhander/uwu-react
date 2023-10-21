export interface ISendFormByCDConfig<T> {
    beforeSending?: (data: T | null) => T | null;
    compare?: (prevData: T | null, newData: T | null) => boolean;
}
//# sourceMappingURL=types.d.ts.map