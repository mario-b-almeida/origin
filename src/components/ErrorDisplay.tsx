import * as React from "react"

export const ErrorDisplay: React.SFC<{ error: string }> = ({ error }) => {
    if (!error) return null

    return <div className="error-display">{error}</div>
}
