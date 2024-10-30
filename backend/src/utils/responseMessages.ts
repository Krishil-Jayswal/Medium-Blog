export enum ResponseMessage {
    // Bad requests.
    InvalidInput = 'Please provide a valid set of inputs.',
    CredentialConflict = 'Email is already registered.',
    InvalidCredentials = 'Please provide a valid password.',
    Unauthorized = 'User not logged in.',
    InvalidBlogId = 'Invalid blog Id format.',
    
    // Resource not found.
    BlogNotFound = 'Blog post not found.',
    UserNotFound = 'No user exits with this email.',

    // Successful request and their respective responses.
    NewResourceCreation = 'User created successfully.',
    LoggedIn = 'User logged in successfully.',
    BlogCreated = 'Blog post created successfully.',
    BlogUpdated = 'Blog post updated successfully.',
    
    // Internal Error and their respective reasons.
    InternalError   = 'Something went wrong. Please try again.',
    IESignUp        = 'Error while creating account.',
    IESignIn        = 'Error while signing in.',
    IEBulk          = 'Error while fetching bulk blogs.',
    IEBlog          = 'Error while fetching blog information.',
    IECreateBlog    = 'Error while creating blog.',
    IEBlogUpdate    = 'Error while updating blog.',
}
