export interface CreateRequest {
  description: string,
  title: string,
  roomName: string,
  groupId: number,
  startDate: string,
  endDate: string | Date,
  approvers?: string[] | undefined,
}