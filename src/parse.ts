import {
    COLON,
    EQUAL,
    SEMICOLON,
    NEW_LINE,

    BEGIN,
    END,

    ComponentType
} from './constants'
import {
    KeyValue,
    TreeType
} from './types'

/**
 * Returns JSON structure of processed ICS tree
 *
 * @example output:
 *
 * ```json
 *  {
 *    "VCALENDAR": [
 *      {
 *        "PRODID": "-//Google Inc//Google Calendar 70.9054//EN",
 *        "VERSION": "2.0",
 *        "CALSCALE": "GREGORIAN",
 *        "X-WR-CALNAME": "calmozilla1@gmail.com",
 *        "X-WR-TIMEZONE": "America/Los_Angeles",
 *        "VTIMEZONE": [
 *          {
 *            "TZID": "America/Los_Angeles",
 *            "X-LIC-LOCATION": "America/Los_Angeles",
 *            "DAYLIGHT": [
 *              {
 *                "TZOFFSETFROM": "-0800",
 *                "TZOFFSETTO": "-0700",
 *                "TZNAME": "PDT",
 *                "DTSTART": "19700308T020000",
 *                "RRULE": "FREQ=YEARLY;BYMONTH=3;BYDAY=2SU"
 *              }
 *            ],
 *            "STANDARD": [
 *              {
 *                "TZOFFSETFROM": "-0700",
 *                "TZOFFSETTO": "-0800",
 *                "TZNAME": "PST",
 *                "DTSTART": "19701101T020000",
 *                "RRULE": "FREQ=YEARLY;BYMONTH=11;BYDAY=1SU"
 *              }
 *            ]
 *          }
 *        ],
 *        "VEVENT": [
 *          {
 *            "DTSTART;TZID=America/Los_Angeles": "20120630T060000",
 *            "DTEND;TZID=America/Los_Angeles": "20120630T070000",
 *            "DTSTAMP": "20120724T212411Z",
 *            "UID": "dn4vrfmfn5p05roahsopg57h48@google.com",
 *            "CREATED": "20120724T212411Z",
 *            "DESCRIPTION": "",
 *            "LAST-MODIFIED": "20120724T212411Z",
 *            "LOCATION": "",
 *            "SEQUENCE": "0",
 *            "STATUS": "CONFIRMED",
 *            "SUMMARY": "Really long event name thing",
 *            "TRANSP": "OPAQUE",
 *            "VALARM": [
 *              {
 *                "ACTION": "EMAIL",
 *                "DESCRIPTION": "This is an event reminder",
 *                "SUMMARY": "Alarm notification",
 *                "ATTENDEE": "mailto:calmozilla1@gmail.com",
 *                "TRIGGER": "-P0DT0H30M0S"
 *              },
 *              {
 *                "ACTION": "DISPLAY",
 *                "DESCRIPTION": "This is an event reminder",
 *                "TRIGGER": "-P0DT0H30M0S"
 *              }
 *            ]
 *          }
 *        ]
 *      }
 *    ]
 *  }
 * ```
 *
 * @param rawLines input array of string from the ICS file
 */
export function parseString(rawLines: string): TreeType;
export function parseString(rawLines: string[]): TreeType;
export function parseString(rawLines: string | string[]): TreeType {
    if (!Array.isArray(rawLines)) rawLines = rawLines.split(NEW_LINE);
    rawLines = rawLines.map((line) => line.trim());
    return process(rawLines)
}

/**
 * Returns a JSON tree based on ICS format
 *
 * @param lines raw lines preprocessed for multi content lines
 * @param intend optional, used for debugging tree data
 */
const process = (lines: string[], intend: number = 0): TreeType => {
    const output: TreeType = {}
    let componentName: ComponentType

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const index = line.indexOf(COLON)

        const key = line.substring(0, index)
        const value = line.substring(index + 1)

        if (key === BEGIN) {
            componentName = value as any
            const lastLine = [END, componentName].join(COLON)
            const lastIndex = lines.indexOf(lastLine, i)

            const newLines = lines.slice(i + 1, lastIndex)

            if (newLines.length) {
                const tree = process(newLines, intend + 1)

                if (!output[componentName])
                    output[componentName] = []

                const array: TreeType[] = output[componentName] as any
                array.push(tree)
                output[componentName] = array

                i = lastIndex
            }
        } else if (line && !line.startsWith(END)) {
            const kv = processKeyValue(key, value)

            if (kv) {
                const k = kv.key
                output[k] = kv
            } else {
                output[key] = value
            }

        }
    }

    return output
}


const processKeyValue = (rawKey: string, rawValue: string): KeyValue | null => {
    if (rawKey.includes(SEMICOLON)) {
        const keys = rawKey.split(SEMICOLON)
        const key = keys[0]

        const obj: KeyValue = {
            key,
            __value__: rawValue
        }

        for (let i = 1; i < keys.length; i++) {
            const kv = keys[i].split(EQUAL)
            const k = kv[0]
            const v = kv[1]
            obj[k] = v
        }

        return obj
    }

    return null
}