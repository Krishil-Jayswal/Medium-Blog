export enum ResponseStatus {
    InvalidInput = 400,
    CredentialConflict = 409,
    InternalError = 500,
    NewResourceCreation = 201,
    UserNotFound = 403,
    InvalidCredentials = 403,
    Success = 200,
    Unauthorized = 401,
    NotFound = 404
}
