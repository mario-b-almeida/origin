// import { get } from "../utils/https"

const Pipe = (...functions: Function[]) => (initialValue: any) => {
    return functions.reduce((acc, fn: Function): Function => fn(acc), initialValue)
}

export const filter = (vin: string) => {
    return Pipe(
        (initialInput: string) => initialInput.toUpperCase(),
        (upperCaseInput: string) => upperCaseInput.replace(/ioq/gim, ""),
        (filteredInput: string) => filteredInput.slice(0, 17)
    )(vin || "")
}

export const validate = (_vin: string): string => null

export const convert = (_res: VinCheckResponse): CarInfo => null

export const apiCheck = async (_vin: string): Promise<CarInfo> => null
