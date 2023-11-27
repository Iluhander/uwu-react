export interface ISendFormByCDConfig<T> {
    /**
     * Called before making new request with form data.
     * @param data - current data.
     * @returns - processed data.
     */
    beforeSending?: (data: T | null) => T | null;
    /**
     * Compares previous and current form data values. Defaults to shallow comparison.
     */
    compare?: (prevData: T | null, newData: T | null) => boolean;
    /**
     * Cool Down time in ms. Defaults to 5000.
     */
    coolDown?: number;
    /**
     * When this parameter is set, data auto saves into localStorage.<name> each localSavingCoolDown ms.
     */
    name?: string;
    /**
     * Cool Down of locally saving data in ms. Default to 2000.
     */
    localSavingCoolDown?: number;
}
//# sourceMappingURL=types.d.ts.map