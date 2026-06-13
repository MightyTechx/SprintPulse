import { IAuthUser } from '@infygen/interfaces';

export type AccessRequestRow = IAuthUser & { sno?: number };
export type ActionType = 'approve' | 'reject';
