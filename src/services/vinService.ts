import * as R from "ramda"
import { get } from "../utils/https"
import { getStore, actions } from "../store"

// Vin API
import vinApi from "../utils/vin_api"

// Application Errors Map
import errorsMap from "../config/errorsMap"

// Utils
// import { parseErrorCode } from '../utils'

export const filter = (vin: string) => {
    return R.pipe(
        (initialInput: string) => initialInput.toUpperCase(),
        (upperCaseInput: string) => upperCaseInput.replace(/ioq/gim, ""),
        (filteredInput: string) => filteredInput.slice(0, 17)
    )(vin || "")
}

// const removeIOQ = R.replace(/ioq/gim, "")
// const trimChars = R.take(17)

export const validate = (_vin: string): string => {
    const filteredInput = filter(_vin)

    return filteredInput.length < 17 ? "17 chars expected" : ""
}
// export const validate = (_vin: string): string => {
//     if(R.lt(R.length(_vin), 17))
// }

export const convert = (_res: VinCheckResponse): CarInfo => null

export const apiCheck = async (_vin: string): Promise<CarInfo> => {
    // Dipatcher
    const dispatch = getStore().dispatch

    const { ROOT_URL } = vinApi

    try {
        const result = await get(`${ROOT_URL}${_vin}?format=json`)
        // Getting only the first result...so far I haven't checked if a VIN search can return multiple vehicles
        const rawVehicle = R.pipe(
            R.pathOr({}, ["Results"]),
            R.head,
            R.pick(["Make", "Model", "Trim", "VehicleType", "ModelYear", "ErrorCode", "ErrorText"])
        )(result)

        // In cases where there's no data returned, terminates the code
        // if(R.isEmpty(rawVehicle)) {
        //     console.log('[ERROR] - Empty Object')
        //     dispatch(actions.checkVinFail(errorsMap['A01']))
        //     return null
        // }

        const errorCodes = R.pipe(R.prop("ErrorCode"), R.split(","), R.filter(code => !!Number(code)))(rawVehicle)

        if (!R.isEmpty(errorCodes)) {
            console.log("[ERROR] - ")
            dispatch(actions.checkVinFail(errorsMap["A02"]))
            // We could also show the user the content of the 'TextError' prop, from the API, if those feedback messages are clear!
            return null
        }

        const finalPayload = {
            make: rawVehicle.Make,
            model: rawVehicle.Model,
            year: Number(rawVehicle.ModelYear),
            trim: rawVehicle.Trim,
            vehicleType: rawVehicle.VehicleType
        }

        dispatch(actions.checkVinSuccess(finalPayload))

        return finalPayload
    } catch (error) {}
}

export const setApiAsSucceded = (result: any) => console.log("success", result)

export const setApiAsFailed = (result: any) => {
    // Dipatcher
    const dispatch = getStore().dispatch
    console.log("failure", result)
    dispatch(actions.checkVinFail(errorsMap["A01"]))
}
