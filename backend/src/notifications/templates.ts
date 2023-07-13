import NotificationTemplate from '../types/NotificationTemplate';
import EventTypes from '../types/EventTypes';

const templates: { [event: string]: NotificationTemplate } = {};

templates[EventTypes.BOOKING_CREATED] = {
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

templates[EventTypes.BOOKING_UPDATED] = {
    template: 'A booking has been updated by {{full_name}} for {{room_friendly}}.',
    email: {
        subject: '{{full_name}} from {{group_name}} updated a booking',
        html: `
            <p>Hi {{receiver_full_name}},</p>
            <p>{{full_name}} from {{group_name}} has updated a booking for {{room_friendly}} ({{room}}).</p>
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

templates[EventTypes.BOOKING_DELETED] = {
    template: 'A booking has been deleted by {{full_name}} for {{room_friendly}}.',
    email: {
        subject: '{{full_name}} from {{group_name}} deleted a booking',
        html: `
            <p>Hi {{receiver_full_name}},</p>
            <p>{{full_name}} from {{group_name}} has deleted a booking for {{room_friendly}} ({{room}}).</p>
            <p>Booking details:</p>
            <ul>
                <li>Booking ID: {{booking_id}}</li>
                <li>Title: {{title}}</li>
                <li>Description: {{description}}</li>
                <li>Start time: {{start_date}}</li>
                <li>End time: {{end_date}}</li>
            </ul>
            <br>
            <p>Thanks,</p>
            <p>Hacklab Booking Team</p>
        `,
    },
};

templates[EventTypes.BOOKING_APPROVED] = {
    template: 'A booking has been approved by {{approver_full_name}} for {{room_friendly}}.',
    email: {
        subject: '{{approver_full_name}} approved a booking.',
        html: `
            <p>Hi {{receiver_full_name}},</p>
            <p>{{approver_full_name}} has approved a booking for {{room_friendly}} ({{room}}).</p>
            <p>Booking details:</p>
            <ul>
                <li>Booking ID: {{booking_id}}</li>
                <li>Title: {{title}}</li>
                <li>Description: {{description}}</li>
                <li>Start time: {{start_date}}</li>
                <li>End time: {{end_date}}</li>
            </ul>
            <br>
            
            <p>Thanks,</p>
            <p>Hacklab Booking Team</p>
             `,
    },
};

templates[EventTypes.BOOKING_REJECTED] = {
    template: 'A booking has been rejected by {{approver_full_name}} for {{room_friendly}}',
    email: {
        subject: '{{approver_full_name}} rejected a booking.',
        html: `
            <p>Hi {{receiver_full_name}},</p>
            <p>{{approver_full_name}} has rejected a booking for {{room_friendly}} ({{room}}).</p>
            <p>Booking details:</p>
            <ul>
                <li>Booking ID: {{booking_id}}</li>
                <li>Title: {{title}}</li>
                <li>Description: {{description}}</li>
                <li>Start time: {{start_date}}</li>
                <li>End time: {{end_date}}</li>
            </ul>
            <br>
            
            <p>Thanks,</p>
            <p>Hacklab Booking Team</p>
                `,
    },
};

templates[EventTypes.BOOKING_CANCELLED] = {
    template: 'A booking has been cancelled by {{full_name}} for {{room_friendly}}.',
    email: {
        subject: '{{full_name}} from {{group_name}} cancelled a booking',
        html: `
            <p>Hi {{receiver_full_name}},</p>
            <p>{{full_name}} from {{group_name}} has cancelled a booking for {{room_friendly}} ({{room}}).</p>
            <p>Booking details:</p>
            <ul>
                <li>Booking ID: {{booking_id}}</li>
                <li>Title: {{title}}</li>
                <li>Description: {{description}}</li>
                <li>Start time: {{start_date}}</li>
                <li>End time: {{end_date}}</li>
            </ul>
            <br>
            <p>Thanks,</p>
            <p>Hacklab Booking Team</p>
        `,
    },
};

export default templates as { readonly [event: string]: NotificationTemplate };
