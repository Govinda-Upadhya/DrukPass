use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Name should be at most 50 bytes.")]
    NameLengthError,

    #[msg("Country name should be at most 50 bytes.")]
    CountryNameLengthError,

    #[msg("District name should be at most 50 bytes.")]
    DistrictLengthError,

    #[msg("Slug should be at most 50 bytes.")]
    SlugLengthError,

    #[msg("Maximum allowed age is 149.")]
    MaxAgeError,

    #[msg("Unauthorized.")]
    Unauthorized,
}