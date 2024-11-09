// template field will be used for all notifications unless a specific one is defined
export default interface NotificationTemplate {
  template: string;
  slack?: string;
  discord?: string;
  email?:
    | {
        subject: string;
        html: string;
      }
    | string;
}
