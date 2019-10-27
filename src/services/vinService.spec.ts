import {
    convert,
    filter,
    parseMake,
    parseModel,
    parseTrim,
    parseYear,
    parseVehicleType,
    parseVehicle
} from "./vinService"
import { vinCheckResponseFixture, vinResultEntryFixture, validVehicleData } from "../test/fixtures"

describe("Vin Service", () => {
    describe.skip("Response converter", () => {
        it("gives empty result when no data is given", () => expect(convert(null)).toEqual(null))
        it("gives empty result when invalid data is given", () => expect(convert({} as any)).toEqual(null))
        it("gives empty result when response contains no data", () =>
            expect(convert(vinCheckResponseFixture({ Results: [] }))).toEqual(null))

        const entry = (Variable: string, Value: string) => vinResultEntryFixture({ Variable, Value })

        it("takes make from Results array", () =>
            expect(convert(vinCheckResponseFixture({ Results: [entry("Make", "HONDA")] })).make).toEqual("HONDA"))

        it("takes year from Results array", () =>
            expect(convert(vinCheckResponseFixture({ Results: [entry("Model Year", "2007")] })).year).toEqual(2007))

        it("takes type from Results array", () =>
            expect(
                convert(vinCheckResponseFixture({ Results: [entry("Vehicle Type", "PASSENGER CAR")] })).vehicleType
            ).toEqual("PASSENGER CAR"))

        it("takes trim from Results array", () =>
            expect(convert(vinCheckResponseFixture({ Results: [entry("Trim", "FN2")] })).trim).toEqual("FN2"))

        it("takes all values from Results", () =>
            expect(
                convert(
                    vinCheckResponseFixture({
                        Results: [
                            entry("Make", "MAZDA"),
                            entry("Model Year", "2010"),
                            entry("Model", "rx8"),
                            entry("Vehicle Type", "CAR"),
                            entry("Trim", "RX8")
                        ]
                    })
                )
            ).toEqual({
                make: "MAZDA",
                year: 2010,
                model: "rx8",
                vehicleType: "CAR",
                trim: "RX8"
            }))
    })

    describe("Response converter", () => {
        it('Must Receive a Result and return "make"', () => {
            const make = parseMake(validVehicleData)

            expect(make).toEqual("FREIGHTLINER")
        })

        it('Must Receive a Result and return "model"', () => {
            const model = parseModel(validVehicleData)

            expect(model).toEqual("FL70")
        })

        it('Must Receive a Result and return "trim"', () => {
            const trim = parseTrim(validVehicleData)

            expect(trim).toEqual("TEST TRIM")
        })

        it('Must Receive a Result and return "vehicleType"', () => {
            const vehicleType = parseVehicleType(validVehicleData)

            expect(vehicleType).toEqual("TRUCK")
        })

        it('Must Receive a Result and return "year"', () => {
            const year = parseYear(validVehicleData)

            expect(year).toEqual(2009)
        })

        it('Must Receive a Result and return "all" desirable data', () => {
            const vehicle = parseVehicle(validVehicleData)

            expect(vehicle).toEqual({
                make: "FREIGHTLINER",
                model: "FL70",
                trim: "TEST TRIM",
                vehicleType: "TRUCK",
                year: 2009
            })
        })
    })

    describe("Vin string filter", () => {
        it("uppercases given string", () => expect(filter("abc")).toEqual("ABC"))
        it("disallows IOQ", () => expect(filter("IOQabc")).toEqual("ABC"))
        it("disallows ioq", () => expect(filter("ioqabc")).toEqual("ABC"))
        it("trims to first 17 chars", () => expect(filter("SHHFN23607U002758abc")).toEqual("SHHFN23607U002758"))
    })
})
