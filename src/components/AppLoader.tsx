import * as React from "react"
// Styles
import "./AppLoader.scss"

// Components
// import Pulse from 'components/Loaders/Pulse'

interface Props {
    history: any
}

export const AppLoader: React.SFC<Props> = ({ history }) => {
    React.useEffect(() => {
        setTimeout(() => {
            console.log(history)
            // history.push('/vin')
        }, 5000)
    }, [])

    return (
        <section className="app-loader">
            <div className="app-loader__wrapper">
                <h1 className="app-loader__heading">Welcome to Origin</h1>

                <p className="app-loader__intro">We're loading your VIN Checker</p>
                <div className="app-loader__pulse-wrapper">
                    <div className="pulse-loader">
                        <svg
                            viewBox="0 0 40 40"
                            shapeRendering="geometricPrecision"
                            textRendering="geometricPrecision"
                            imageRendering="optimizeQuality"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            className="pulse-loader__svg"
                        >
                            <circle className="pulse-loader__inner-circle" cx={20} cy={20} r={11} />
                            <circle className="pulse-loader__outer-circle" cx={20} cy={20} r={19} />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    )
}
