export type KeyValue = {
    key: string;
    __value__: any;
    [key: string]: string;
}

export type TreeType = {
    [key: string]: TreeType[] | TreeType | string
}

// Adapted from https://github.com/jens-maus/node-ical/blob/master/node-ical.d.ts
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//  http://www.apache.org/licenses/LICENSE-2.0

export type CalendarResponse = Record<CalendarComponentTypes, CalendarComponent>;

export type CalendarComponent = VTimeZone | VEvent | VCalendar;
export type CalendarComponentTypes = "VTimeZone" | "VEvent" | "VCalendar" | string

export type VTimeZone = TimeZoneProps & TimeZoneDictionary;

interface TimeZoneProps extends BaseComponent {
    type: 'VTIMEZONE';
    tzid: string;
    tzurl: string;
}

type TimeZoneDictionary = Record<string, TimeZoneDef | undefined>;

export interface VEvent extends BaseComponent {
    type: 'VEVENT';
    method?: Method;
    dtstamp?: string;
    uid?: string;
    sequence?: string;
    transparency?: Transparency;
    class?: Class;
    summary?: string;
    start: string;
    datetype?: DateType;
    end: string;
    location?: string;
    description?: string;
    url?: string;
    completion?: string;
    created?: string;
    lastmodified?: string;
    rrule?: string; // rrule.rrule
    attendee?: Attendee[] | Attendee;
    /* eslint-disable-next-line @typescript-eslint/ban-types */
    recurrences?: Record<string, Omit<VEvent, 'recurrences'>>;
    status?: VEventStatus;
}

/**
 * Contains alls metadata of the Calendar
 */
export interface VCalendar extends BaseComponent {
    type: 'VCALENDAR';
    prodid?: string;
    version?: string;
    calscale?: 'GREGORIAN' | string;
    method?: Method;
    'WR-CALNAME'?: string;
    'WR-TIMEZONE'?: string;
}

export interface BaseComponent {
    params: any[];
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

type Property<A> = PropertyWithArgs<A> | string;

interface PropertyWithArgs<A> {
    val: string;
    params: A & Record<string, unknown>;
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
