export const Sleep = <T>(ms: number): Promise<T> => new Promise<T>((res) => setTimeout(res, ms));
