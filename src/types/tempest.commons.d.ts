export interface IHasCreatedAt {
    createdAt?: Date
}

export interface IHasUpdatedAt {
    updatedAt?: Date
}

export type IHasTimeStamp = IHasCreatedAt & IHasUpdatedAt;
