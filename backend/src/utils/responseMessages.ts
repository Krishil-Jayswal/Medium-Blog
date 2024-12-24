export enum ResponseMessage {
  // Bad requests.
  InvalidBlogId = "Invalid blog Id format.",
  NotAllowed = "The email is already registered without google auth.",

  // Resource not found.
  BlogNotFound = "Blog post not found.",
  UserNotFound = "No user exits with this email.",

  // Successful request and their respective responses.
  BlogCreated = "Blog post created successfully.",
  BlogUpdated = "Blog post updated successfully.",

  // Internal Error and their respective reasons.
  IESignUp = "Error while creating account.",
  IESignIn = "Error while signing in.",
  IEBulk = "Error while fetching bulk blogs.",
  IEBlog = "Error while fetching blog information.",
  IECreateBlog = "Error while creating blog.",
  IEBlogUpdate = "Error while updating blog.",
  IEGoogleAuth = "Error while continuing with google.",
}
