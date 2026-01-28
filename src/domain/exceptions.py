class DomainError(Exception):
    """Base domain error"""


class ValidationError(DomainError):
    """non-compliance with domain model rules"""
    def __init__(self, fields: list[str] | None = None):
        self.fields = fields


class FrendlyValidationError(ValidationError):
    """User-frendly invalid domain model rules"""
    def __init__(self, use_frendly_output: str, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.use_frendly_output = use_frendly_output
