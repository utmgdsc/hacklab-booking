import { UserWebhooks, WebhookTypes } from '../types/webhooksTypes';
import EventTypes from '../types/EventTypes';
import { read } from 'fs';
import logger from '../common/logger';

const defaultWebhooksSetttings : UserWebhooks = {};

defaultWebhooksSetttings[EventTypes.BOOKING_APPROVAL_REQUESTED] = [WebhookTypes.discord, WebhookTypes.email, WebhookTypes.slack];
defaultWebhooksSetttings[EventTypes.BOOKING_STATUS_CHANGED] = [WebhookTypes.discord, WebhookTypes.email, WebhookTypes.slack];
defaultWebhooksSetttings[EventTypes.BOOKING_UPDATED] = [WebhookTypes.discord, WebhookTypes.email, WebhookTypes.slack];
defaultWebhooksSetttings[EventTypes.BOOKING_CREATED] = [WebhookTypes.discord, WebhookTypes.email, WebhookTypes.slack];
defaultWebhooksSetttings[EventTypes.ADMIN_BOOKING_STATUS_CHANGED] = [WebhookTypes.discord, WebhookTypes.email, WebhookTypes.slack];
defaultWebhooksSetttings[EventTypes.ADMIN_ROOM_ACCESS_REVOKED] = [WebhookTypes.discord, WebhookTypes.email, WebhookTypes.slack];
defaultWebhooksSetttings[EventTypes.ADMIN_ROOM_ACCESS_GRANTED] = [WebhookTypes.discord, WebhookTypes.email, WebhookTypes.slack];

logger.debug(`defaultWebhooksSetttings: ${JSON.stringify(defaultWebhooksSetttings)}`);
export default defaultWebhooksSetttings as { readonly [key: string]: WebhookTypes[] };
