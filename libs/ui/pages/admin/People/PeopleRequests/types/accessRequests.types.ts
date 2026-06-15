import { IAuthUser } from '@sprintpulse/interfaces';

export type AccessRequestRow = IAuthUser & { sno?: number };
export type ActionType = 'approve' | 'reject';
