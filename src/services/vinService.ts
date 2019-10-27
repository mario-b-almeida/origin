import * as R from "ramda"
import { get } from "../utils/https"
import { getStore, actions } from "../store"

// Vin API
import vinApi from "../utils/vin_api"

// Application Errors Map
import errorsMap from "../config/errorsMap"

const removeIOQ = R.replace(/ioq/gim, "")
const trimChars = R.take(17)

export const filter = R.pipe(R.toUpper, removeIOQ, input => trimChars(input))

export const validate = R.pipe(
    filter,
    R.ifElse((input: string) => R.lt(R.length(input), 17), R.always("17 chars expected"), R.always(null))
)

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
            dispatch(actions.checkVinFail(errorsMap["A02"]))
            // We could also show the user the content of the 'TextError' prop,
            // from the API, if those feedback messages are clear!
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

export const setApiAsSucceded = (result: any) => result

export const setApiAsFailed = (_: any) => {
    // Dipatcher
    const dispatch = getStore().dispatch
    dispatch(actions.checkVinFail(errorsMap["A01"]))
}
