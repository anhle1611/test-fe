export interface GuestRequest {
    readonly offset: number;
    readonly limit: number;
    readonly search?: string;
}

export interface UpdateGuestRequest {
    readonly name: string;
    readonly description?: string;
}