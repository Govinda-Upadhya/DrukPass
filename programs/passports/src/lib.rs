pub mod error;

use crate::error::ErrorCode;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::pubkey;

declare_id!("J2YJKi9j2uHExj69bmKmqiA4igoP7zLrv985zfsPE4mt");
pub const ADMIN: Pubkey =pubkey!("7jJHX34s1DT91iS5vpVQnrTEJP2VGrFQsziNRaM6YUFx");
#[program]
pub mod passports {
    use super::*;

    pub fn initializetraveler(
        ctx: Context<InitializeTraveler>,
        name: String,
        age: u8,
        country: String,
    ) -> Result<()> {
        require!(name.len() <= 50, ErrorCode::NameLengthError);
        require!(country.len() <= 50, ErrorCode::CountryNameLengthError);
        require!(age < 150, ErrorCode::MaxAgeError);

        let traveler = &mut ctx.accounts.traveler_account;

        traveler.authority = ctx.accounts.user.key();
        traveler.name = name;
        traveler.age = age;
        traveler.country = country;
        traveler.number_of_places_visited = 0;
        traveler.bump = ctx.bumps.traveler_account;
        traveler.created_at = Clock::get()?.unix_timestamp;

        msg!("Traveler profile created successfully.");

        Ok(())
    }

    pub fn initializelocation(
        ctx: Context<CreateLocation>,
        slug: String,
        name: String,
        district: String,
    ) -> Result<()> {
        require_keys_eq!(
            ctx.accounts.admin.key(),
            ADMIN,
            ErrorCode::Unauthorized
        );
        require!(slug.len() <= 50, ErrorCode::SlugLengthError);
        require!(name.len() <= 50, ErrorCode::NameLengthError);
        require!(district.len() <= 50, ErrorCode::DistrictLengthError);

        let location = &mut ctx.accounts.location;

        location.slug = slug;
        location.name = name;
        location.district = district;
        location.bump = ctx.bumps.location;

        msg!("Location initialized successfully.");

        Ok(())
    }
    pub fn claim_stamp(ctx: Context<ClaimStamp>) -> Result<()> {
        let traveler = &mut ctx.accounts.traveler_account;
        let stamp = &mut ctx.accounts.stamp;
        let location = &ctx.accounts.location;

        require_keys_eq!(
            traveler.authority,
            ctx.accounts.user.key(),
            ErrorCode::Unauthorized
        );

        stamp.traveler = traveler.key();
        stamp.location = location.key();
        stamp.visited_at = Clock::get()?.unix_timestamp;
        stamp.bump = ctx.bumps.stamp;

        traveler.number_of_places_visited += 1;

        msg!("Stamp claimed successfully.");

        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct TravelerData {
    pub authority: Pubkey,

    #[max_len(50)]
    pub name: String,

    pub age: u8,

    #[max_len(50)]
    pub country: String,

    pub number_of_places_visited: u8,

    pub bump: u8,

    pub created_at: i64,
}

#[account]
#[derive(InitSpace)]
pub struct Location {
    #[max_len(50)]
    pub slug: String,

    #[max_len(50)]
    pub name: String,

    #[max_len(50)]
    pub district: String,

    pub bump: u8,
}
#[account]
#[derive(InitSpace)]
pub struct Stamp {
    pub traveler: Pubkey,     
    pub location: Pubkey,     
    pub visited_at: i64,      
    pub bump: u8,
}
#[derive(Accounts)]
pub struct InitializeTraveler<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + TravelerData::INIT_SPACE,
        seeds = [b"traveler-profile", user.key().as_ref()],
        bump
    )]
    pub traveler_account: Account<'info, TravelerData>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(slug: String)]
pub struct CreateLocation<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + Location::INIT_SPACE,
        seeds = [b"location", slug.as_bytes()],
        bump
    )]
    pub location: Account<'info, Location>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct ClaimStamp<'info> {
    #[account(
        mut,
        seeds = [b"traveler-profile", user.key().as_ref()],
        bump = traveler_account.bump,
      
    )]
    pub traveler_account: Account<'info, TravelerData>,

    #[account(
        mut
    )]
    pub location: Account<'info, Location>,

    #[account(
        init,
        payer = user,
        space = 8 + Stamp::INIT_SPACE,
        seeds = [
            b"stamp",
            traveler_account.key().as_ref(),
            location.key().as_ref()
        ],
        bump
    )]
    pub stamp: Account<'info, Stamp>,

    
    

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}
