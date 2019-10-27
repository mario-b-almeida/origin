import * as React from "react"
import { bindBem } from "../utils/bem"
import "./VinInput.scss"

const { block, element } = bindBem("VinInput")

interface Props {
    value: string
    error?: string
    onChange: (value: string) => void
    className?: string
    html5Validation?: boolean
}

export const VinInput: React.SFC<Props> = ({ value, className, error, onChange, html5Validation = false }) => (
    <div className={block({ invalid: !!error }, className)}>
        {html5Validation ? (
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                type="text"
                required
                pattern="[^\s]{17,}"
                title="Type17 chars"
            />
        ) : (
            <input type="text" value={value} onChange={e => onChange(e.target.value)} />
        )}
        {error && <div className={element("Error")}>{error}</div>}
    </div>
)
