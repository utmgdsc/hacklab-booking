export interface CreateRequest {
  description: string,
  title: string,
  roomName: string,
  groupId: string,
  startDate: string,
  endDate: string | Date,
  approvers?: string[] | undefined,
}