import NotificationTemplate from '../types/NotificationTemplate';
import EventTypes from '../types/EventTypes';

const templates: { [event: string]: NotificationTemplate } = {};

templates[EventTypes.ADMIN_BOOKING_CREATED] = {
  template: 'A new booking has been created by {{full_name}} for {{room_friendly}}.',
  email: {
    subject: '{{full_name}} from {{group_name}} created a new booking',
    html: `
        <p>Hi {{receiver_full_name}},</p>
        <p>{{full_name}} from {{group_name}} has created a new booking for {{room_friendly}} ({{room}}).</p>
        <p>Booking details:</p>
        <ul>
            <li>Booking ID: {{booking_id}}</li>
            <li>Title: {{title}}</li>
            <li>Description: {{description}}</li>
            <li>Start time: {{start_date}}</li>
            <li>End time: {{end_date}}</li>
        </ul>
        <p><a href="{{frontend_url}}/approve/{{booking_id}}">Approve</a> or <a href="{{frontend_url}}/deny/{{booking_id}}">Deny</a> the booking.</p>
        <br>
        <p>Thanks,</p>
        <p>Hacklab Booking Team</p>
    `,
  },
};

templates[EventTypes.BOOKING_APPROVAL_REQUESTED] = {
  template: '{{full_name}} from {{group_name}} has requested your approval for a booking for {{room_friendly}}.',
  email: {
    subject: '{{full_name}} from {{group_name}} requested your approval for a booking',
    html: `
            <p>Hi {{receiver_full_name}},</p>
            <p>{{full_name}} from {{group_name}} has requested your approval for a booking for {{room_friendly}} ({{room}}).</p>
            <p>Booking details:</p>
            <ul>
                <li>Booking ID: {{booking_id}}</li>
                <li>Title: {{title}}</li>
                <li>Description: {{description}}</li>
                <li>Start time: {{start_date}}</li>
                <li>End time: {{end_date}}</li>
            </ul>
            <p><a href="{{frontend_url}}/approve/{{booking_id}}">Approve</a> or <a href="{{frontend_url}}/deny/{{booking_id}}">Deny</a> the booking.</p>
            <br>
            <p>Thanks,</p>
            <p>Hacklab Booking Team</p>
        `,
  },
};

templates[EventTypes.ADMIN_BOOKING_UPDATED] = {
  template: 'Your booking {{title}} for {{room_friendly}} has been updated by {{changer_utorid}}.',
  email: {
    subject: 'Your booking {{title}} for {{room_friendly}} has been updated by {{changer_utorid}}.',
    html: `
            <p>Hi {{receiver_full_name}},</p>
            <p>Your booking {{title}} for {{room_friendly}} has been updated by {{changer_utorid}}.</p>
            <p>New Booking details:</p>
            <ul>
                <li>Booking ID: {{booking_id}}</li>
                <li>Title: {{title}}</li>
                <li>Description: {{description}}</li>
                <li>Start time: {{start_date}}</li>
                <li>End time: {{end_date}}</li>
            </ul>
            <p>Click <a href="{{frontend_url}}/bookings/{{booking_id}}">here</a> to view the booking.</p>
            <br>
            <p>Thanks,</p>
            <p>Hacklab Booking Team</p>
        `,
  },
};

templates[EventTypes.BOOKING_STATUS_CHANGED] = {
  template: 'Your booking {{title}} for {{room_friendly}} has been set to: {{status}} by {{changer_utorid}}.',
  email: {
    subject: 'Your booking\'s status has been changed to: {{status}}',
    html: `
            <p>Hi {{receiver_full_name}},</p>
            <p>Your booking {{title}} for {{room_friendly}} has been set to: {{status}} by {{changer_utorid}}.</p>
            <p>Click <a href="{{frontend_url}}/bookings/{{booking_id}}">here</a> to view the booking.</p>
            <br>
            <p>Thanks,</p>
            <p>Hacklab Booking Team</p>
        `,
  },
};

templates[EventTypes.ADMIN_BOOKING_STATUS_CHANGED] = {
  template: 'The booking {{title}} for {{room_friendly}} has been set to: {{status}} by {{changer_utorid}}.',
  email: {
    subject: 'The booking\'s status has been changed to: {{status}}',
    html: `
            <p>Hi {{receiver_full_name}},</p>
            <p>The booking {{title}} for {{room_friendly}} has been set to: {{status}} by {{changer_utorid}}.</p>
            <p>Click <a href="{{frontend_url}}/bookings/{{booking_id}}">here</a> to view the booking.</p>
            <br>
            <p>Thanks,</p>
            <p>Hacklab Booking Team</p>
        `,
  },
};

templates[EventTypes.ROOM_ACCESS_GRANTED] = {
  template: 'You have been granted access to {{room_friendly}} by {{changer_utorid}}.',
  email: {
    subject: 'You have been granted access to {{room_friendly}}',
    html: `
            <p>Hi {{receiver_full_name}},</p>
            <p>You have been granted access to {{room_friendly}} by {{changer_utorid}}.</p>
            <p>Click <a href="{{frontend_url}}/rooms/{{room}}">here</a> to view the room.</p>
            <br>
            <p>Thanks,</p>
            <p>Hacklab Booking Team</p>
        `,
  },
};

templates[EventTypes.ROOM_ACCESS_REVOKED] = {
  template: 'Your access to {{room_friendly}} has been revoked by {{changer_utorid}}.',
  email: {
    subject: 'Your access to {{room_friendly}} has been revoked',
    html: `
            <p>Hi {{receiver_full_name}},</p>
            <p>Your access to {{room_friendly}} has been revoked by {{changer_utorid}}.</p>
            <p>Click <a href="{{frontend_url}}/rooms/{{room}}">here</a> to view the room.</p>
            <br>
            <p>Thanks,</p>
            <p>Hacklab Booking Team</p>
        `,
  },
};

templates[EventTypes.ADMIN_ROOM_ACCESS_GRANTED] = {
  template: '{{full_name}} has been granted access to {{room_friendly}} by {{changer_utorid}}.',
  email: {
    subject: '{{full_name}} has been granted access to {{room_friendly}}',
    html: `
            <p>Hi {{receiver_full_name}},</p>
            <p>{{full_name}} has been granted access to {{room_friendly}} by {{changer_utorid}}.</p>
            <p>Click <a href="{{frontend_url}}/rooms/{{room}}">here</a> to view the room.</p>
            <br>
            <p>Thanks,</p>
            <p>Hacklab Booking Team</p>
        `,
  },
};

templates[EventTypes.ADMIN_ROOM_ACCESS_REVOKED] = {
  template: '{{full_name}}\'s access to {{room_friendly}} has been revoked by {{changer_utorid}}.',
  email: {
    subject: '{{full_name}}\'s access to {{room_friendly}} has been revoked',
    html: `
            <p>Hi {{receiver_full_name}},</p>
            <p>{{full_name}}'s access to {{room_friendly}} has been revoked by {{changer_utorid}}.</p>
            <p>Click <a href="{{frontend_url}}/rooms/{{room}}">here</a> to view the room.</p>
            <br>
            <p>Thanks,</p>
            <p>Hacklab Booking Team</p>
        `,
  },
};

export default templates as { readonly [event: string]: NotificationTemplate };
