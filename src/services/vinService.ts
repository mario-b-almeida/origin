import * as R from "ramda"
import { get } from "../utils/https"
import { getStore, actions } from "../store"

// Vin API
import vinApi from "../utils/vin_api"

// Application Errors Map
import errorsMap from "../config/errorsMap"

const removeIOQ = R.replace(/[ioq]/gim, "")
const trimChars = R.take(17)

export const filter = R.pipe(R.toUpper, removeIOQ, input => trimChars(input))

export const validate = R.pipe(
    filter,
    R.ifElse((input: string) => R.lt(R.length(input), 17), R.always("17 chars expected"), R.always(null))
)

export const parseMake = R.pathOr("N/A", ["Make"])
export const parseModel = R.pathOr("N/A", ["Model"])
export const parseYear = R.pipe(R.pathOr("N/A", ["ModelYear"]), (year: string) => parseInt(year, 10) as number)
export const parseTrim = R.pathOr("N/A", ["Trim"])
export const parseVehicleType = R.pathOr("N/A", ["VehicleType"])

export const parseVehicle = (result: Object) =>
    R.pipe(
        R.assoc("make", parseMake(result)),
        R.assoc("model", parseModel(result)),
        R.assoc("year", parseYear(result)),
        R.assoc("trim", parseTrim(result)),
        R.assoc("vehicleType", parseVehicleType(result))
    )({}) as CarInfo

export const convert = (_res: VinCheckResponse): CarInfo => null

export const apiCheck = async (_vin: string): Promise<CarInfo> => {
    const dispatch = getStore().dispatch

    const { ROOT_URL } = vinApi

    const response = await get(`${ROOT_URL}${_vin}?format=json`)

    const resultSet = R.pipe(R.pathOr("", ["Results"]), R.head)(response)

    const vehicleData = parseVehicle(resultSet)

    const errorCodes = R.pipe(R.prop("ErrorCode"), R.split(","), R.filter(code => !!Number(code)))(resultSet)

    if (!R.isEmpty(errorCodes)) {
        dispatch(actions.checkVinFail(errorsMap["A02"]))
        return null
    }

    return vehicleData
}

export const setApiAsSucceded = (result: any) => {
    const dispatch = getStore().dispatch
    dispatch(actions.checkVinSuccess(result))
}

export const setApiAsFailed = (_: any) => {
    const dispatch = getStore().dispatch
    dispatch(actions.checkVinFail(errorsMap["A01"]))
}
