// Adapted from https://github.com/jens-maus/node-ical/blob/master/node-ical.d.ts
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//  http://www.apache.org/licenses/LICENSE-2.0

export interface CalendarResponse {
    VCalendar: (VCalendar & {
        VEvent?: VEvent[];
        VTimeZone?: VTimeZone[];
    })[]
}

export type CalendarComponent = VCalendar | VTimeZone | VEvent;
export type CalendarComponentTypes = "VCalendar" | "VTimeZone" | "VEvent"

export type VTimeZone = TimeZoneProps & TimeZoneDictionary;

interface TimeZoneProps {
    tzid: string;
    tzurl: string;
}

type TimeZoneDictionary = Record<string, TimeZoneDef | undefined>;

export interface VEvent {
    categories: string | string[];
    method?: Method;
    dtstamp?: string;
    uid: string;
    sequence?: string;
    transp?: Transparency;
    class?: Class;
    summary?: string;
    dtstart: string;
    datetype?: DateType;
    dtend: string;
    "last-modified"?: string
    location?: string;
    description?: string;
    url?: string;
    completion?: string;
    created?: string;
    lastmodified?: string;
    rrule?: string; // rrule.rrule
    attendee?: Attendee[] | Attendee;
    status?: VEventStatus;
}

/**
 * Contains alls metadata of the Calendar
 */
export interface VCalendar {
    prodid?: string;
    version?: string;
    calscale?: 'GREGORIAN' | string;
    method?: Method;
    'WR-CALNAME'?: string;
    'WR-TIMEZONE'?: string;
}

export interface TimeZoneDef {
    type: 'DAYLIGHT' | 'STANDARD';
    params: any[];
    tzoffsetfrom: string;
    tzoffsetto: string;
    tzname: string;
    start: string;
    dateType: DateType;
    rrule: string;
    rdate: string | string[];
}

export type Property<A> = PropertyWithArgs<A> | string;

export type PropertyWithArgs<A> = {
    key: string;
    __value__: A;
} & {
    [key: string]: string;
}

export type Organizer = Property<{
    CN?: string;
}>;

export type Attendee = Property<{
    CUTYPE?: 'INDIVIDUAL' | 'UNKNOWN' | 'GROUP' | 'ROOM' | string;
    ROLE?: 'CHAIR' | 'REQ-PARTICIPANT' | 'NON-PARTICIPANT' | string;
    PARTSTAT?: 'NEEDS-ACTION' | 'ACCEPTED' | 'DECLINED' | 'TENTATIVE' | 'DELEGATED';
    RSVP?: boolean;
    CN?: string;
    'X-NUM-GUESTS'?: number;
}>;

export type DateType = 'date-time' | 'date';
export type Transparency = 'TRANSPARENT' | 'OPAQUE';
export type Class = 'PUBLIC' | 'PRIVATE' | 'CONFIDENTIAL';
export type Method = 'PUBLISH' | 'REQUEST' | 'REPLY' | 'ADD' | 'CANCEL' | 'REFRESH' | 'COUNTER' | 'DECLINECOUNTER';
export type VEventStatus = 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';
