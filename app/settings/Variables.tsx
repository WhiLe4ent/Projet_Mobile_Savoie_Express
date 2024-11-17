import { EventModelComplete } from '../types/Event';

export const isDev = process.env.NODE_ENV === 'development';

const DEV_API_URL = 'http://192.168.1.102:3000/'
const PROD_API_URL = 'https://api.epicuremee.com/'

export const GoogleApiKey = 'AIzaSyArhQeOz_5Qxb_rwdzO46UwR6yP47JU24E'
export const ONE_SIGNAL_APP_ID = '0e565fc3-5d22-421b-a670-5472faf62c1e'
export const API_URL = isDev ? DEV_API_URL : PROD_API_URL
export const MEDIA_URL = isDev ? 'https://medias.test.epicuremee.com/' : 'https://medias.epicuremee.com/'
export const STRIPE_PUBLISHABLE_KEY = isDev ? 'pk_test_51PLM6BEU1u4QZvlymyNQ4ad7d4ImzKEOlVquQPrOVSbly5H4VuPnAc7rXSKygr2Awt62kH6UcWcJ2H8biF681Eg3004Jr2F69z' : 'pk_live_51PLM6BEU1u4QZvlyauwXOdy0aI4uPm67rkQ0Yit5Btqf0Gotksape1t5HtrZoLKLB48oijoTwOtIV9lzzR7EPEDN00V8vyQKeq'

export const postMedia = (media: string) =>
{
    return MEDIA_URL + media
}

export const DateIsOlderThanOneMonth = (date: Date) => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
    return date < oneMonthAgo;
}

export const userProfilePicture = (picture: string|undefined) =>
{
    return API_URL + (picture ? ('images/profile/' + picture) : 'images/unknown.png')
}

export const eventPicture = (picture: string) =>
{
    return API_URL + 'images/events/' + picture
}

export const chatPicture = (picture: string) =>
{
    return API_URL + 'images/chat/' + picture
}

//retrieve user picture with id 
export const userIdProfilePicture = (id: number) =>
{
    return API_URL + 'user/get-profile-picture/' + id
}

export const getCoordinatesFromString = (stringCoordinates: string[]) => 
{
    return {
        latitude: parseFloat(stringCoordinates[1]),
        longitude: parseFloat(stringCoordinates[0])
    }
}

export function getUniqueLocationEvents(events: EventModelComplete[]): EventModelComplete[] {
    const map = new Map<string, EventModelComplete[]>();

    // Grouping events by location
    for (const event of events) {
        const key = event.location.coordinates.join(',');
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key)!.push(event);
    }

    // Filter out locations with only one event
    const uniqueLocationEvents: EventModelComplete[] = [];
    for (const eventsGroup of map.values()) {
        if (eventsGroup.length === 1) {
            uniqueLocationEvents.push(eventsGroup[0]);
        }
    }

    return uniqueLocationEvents;
}

export function groupEventsByLocation(events: EventModelComplete[]): EventModelComplete[][] {
    const map = new Map<string, EventModelComplete[]>();

    for (const event of events) {
        const key = event.location.coordinates.join(',');
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key)!.push(event);
    }

    // Filter out groups that contain only one event
    const filteredGroups = Array.from(map.values()).filter(group => group.length > 1);

    return filteredGroups;
}