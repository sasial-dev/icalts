export const NEW_LINE = /\r\n|\n|\r/
export const SPACE = ' '
export const COLON = ':'
export const SEMICOLON = ';'
export const COMMA = ','
export const EQUAL = '='

export const BEGIN = 'BEGIN'
export const END = 'END'
export const CUSTOM_PROPERTY = /X-[\w-]+/

export const VCALENDAR = 'VCALENDAR'
export const VTIMEZONE = 'VTIMEZONE'
export const VEVENT = 'VEVENT'
export const VALARM = 'VALARM'

export const HIGH_LEVEL_COMPONENTS = {VCALENDAR: "VCalendar", VTIMEZONE: "VTimeZone", VEVENT: "VEvent"} as const;
