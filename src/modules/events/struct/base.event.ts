export enum TOPICS {
  APPLICATION_CREATED = 'parvum.applications.create',
  APPLICATION_UPDATED = 'parvum.applications.updated',
  APPLICATION_DELETED = 'parvum.applications.deleted',
  APPLICATION_RESTORED = 'parvum.applications.restored',
}

export interface BaseData {
  id: string;
  [k: string]: any;
}

export interface BaseEvent<T extends BaseData> {
  id?: string;
  topic: TOPICS;
  entityId: string;
  eventData: T;
}
