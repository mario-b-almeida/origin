// import * as R from "ramda"
import { pipe, pathOr, head, pick } from "ramda"
import { get } from "../utils/https"
import { getStore, actions } from "../store"

// Vin API
import vinApi from "../utils/vin_api"

// Application Errors Map
import errorsMap from "../config/errorsMap"

// Utils
// import { parseErrorCode } from '../utils'

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
        const rawVehicle = pipe(
            pathOr({}, ["Results"]),
            head,
            pick(["Make", "Model", "Trim", "VehicleType", "ModelYear", "ErrorCode", "ErrorText"])
        )(result)

        // const a =  parseErrorCode(rawVehicle)

        // console.log(a)
        // if (!!a) {
        //     console.log(a.ErrorCode, a.ErrorText)
        //     dispatch(actions.checkVinFail(errorsMap['A02']))
        // }

        const finalPayload = {
            make: rawVehicle.Make,
            model: rawVehicle.Model,
            year: Number(rawVehicle.ModelYear),
            trim: rawVehicle.Trim,
            vehicleType: rawVehicle.VehicleType
        }

        dispatch(actions.checkVinSuccess(finalPayload))

        return finalPayload
    } catch (error) {
        dispatch(actions.checkVinFail(errorsMap["A01"]))
    }
}

export const setApiAsSucceded = (result: any) => console.log("success", result)

export const setApiAsFailed = (result: any) => console.log("failure", result)
