import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import type { Passports } from '../../../../target/types/passports';
import idl from '../../../../target/idl/passports.json';

export const PROGRAM_ID = new PublicKey(
  'J2YJKi9j2uHExj69bmKmqiA4igoP7zLrv985zfsPE4mt',
);

export function getProgram(provider: AnchorProvider) {
  return new Program<Passports>(idl as Passports, provider);
}
