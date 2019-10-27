import * as React from "react"
import { connect } from "react-redux"

import { VinInput } from "../components/VinInput"
import { ErrorDisplay } from "../components/ErrorDisplay"
import { CarInfoPreview } from "../components/CarInfoPreview"
import { actions, MapState, MapDispatch } from "../store"
type Props = Pick<RootState, "vin" | "vinCheckResult" | "vinValidationError" | "vinResultError">
type Actions = Pick<typeof actions, "setVin" | "checkVin">

const VinCheck: React.SFC<Props & Actions> = ({
    vin,
    setVin,
    vinValidationError,
    vinCheckResult,
    checkVin,
    vinResultError
}) => (
    <form className="VinCheck" onSubmit={e => e.preventDefault()}>
        <div className="Logo" />
        <h3 className="VinCheck__title">Decode Your Vehicle Identification Number</h3>
        <VinInput value={vin} onChange={setVin} error={vinValidationError} />
        <input
            className="submit-btn"
            value="Decode"
            type="submit"
            disabled={vinCheckResult === "Loading"}
            onClick={checkVin}
        />
        <CarInfoPreview carInfo={vinCheckResult} />
        <ErrorDisplay error={vinResultError} />
    </form>
)

const mapState: MapState<Props> = state => state
const mapDispatch: MapDispatch<Actions> = dispatch => ({
    setVin: vin => dispatch(actions.setVin(vin)),
    checkVin: () => dispatch(actions.checkVin())
})

export const VinCheckView = connect(mapState, mapDispatch)(VinCheck)
