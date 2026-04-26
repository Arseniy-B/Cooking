class AuthAdapterError(Exception):
    pass


class UserExist(AuthAdapterError):
    pass


class NotAuthenticatedError(AuthAdapterError):
    pass


class UserAlreadyExists(AuthAdapterError):
    pass
