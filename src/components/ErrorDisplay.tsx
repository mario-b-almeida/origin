import * as React from "react"
import "./ErrorDisplay.scss"

export const ErrorDisplay: React.SFC<{ error: string }> = ({ error }) => {
    if (!error) return null

    return <div className="Error-display">{error}</div>
}
