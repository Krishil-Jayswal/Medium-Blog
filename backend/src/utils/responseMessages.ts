export enum ResponseMessage {
    InvalidInput = 'Please provide a valid set of inputs.',
    CredentialConflict = 'Email is already registered.',
    NewResourceCreation = 'User created successfully.',
    UserNotFound = 'No user exits with this email.',
    InvalidCredentials = 'Please provide a valid password.',
    LoggedIn = 'User logged in successfully.',
    Unauthorized = 'User not logged in.',
    InvalidBlogId = 'Invalid blog Id format.',
    BlogNotFound = 'Blog post not found.',
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
