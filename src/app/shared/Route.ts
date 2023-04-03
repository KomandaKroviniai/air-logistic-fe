
export interface Route{
  id: bigint;
  assignedUserId: bigint;
  pointA: string;
  pointB: string;
  startDate: Date;
  endDate: Date;
  status: string;
}
