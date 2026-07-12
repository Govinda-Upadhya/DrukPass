import React from 'react';
import '../App.css';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import { Html5QrcodeScanner } from 'html5-qrcode';

import { useProgram } from '../hook/useProgram';
import RegisterModal from '../components/registermodal';
import TravelerProfile from '../components/travelerprofile';
interface Stamp {
  slug: string;
  name: string;
  district: string;
  visitedAt: number;
}
interface Traveler {
  authority: string;
  name: string;
  age: number;
  country: string;
  numberOfPlacesVisited: number;
  createdAt: number;
}

interface Location {
  slug: string;
  name: string;
  district: string;
}

export default function Home() {
  const { publicKey, connected } = useWallet();
  const { program } = useProgram();
  const [stamps, setStamps] = useState<Stamp[]>([]);

  const [scannerOpen, setScannerOpen] = useState(false);

  const [travelerExists, setTravelerExists] = useState<boolean | null>(null);
  const [traveler, setTraveler] = useState<Traveler | null>(null);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [locations, setLocations] = useState<Location[]>([]);
  const [claimingSlug, setClaimingSlug] = useState<string | null>(null);

  async function fetchMyStamps() {
    if (!publicKey) return;

    const [travelerPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('traveler-profile'), publicKey.toBuffer()],
      program.programId,
    );

    const stamps = await program.account.stamp.all([
      {
        memcmp: {
          offset: 8,
          bytes: travelerPda.toBase58(),
        },
      },
    ]);

    const result = await Promise.all(
      stamps.map(async (stamp) => {
        const location = await program.account.location.fetch(
          stamp.account.location,
        );

        return {
          slug: location.slug,
          name: location.name,
          district: location.district,
          visitedAt: stamp.account.visitedAt.toNumber(),
        };
      }),
    );

    console.log('stamps', result);
    setStamps(result);
  }

  async function claimStamp(slug: string) {
    if (!publicKey) return;

    setClaimingSlug(slug);

    try {
      const [travelerPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('traveler-profile'), publicKey.toBuffer()],
        program.programId,
      );

      const [locationPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('location'), Buffer.from(slug)],
        program.programId,
      );

      const [stampPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('stamp'), travelerPda.toBuffer(), locationPda.toBuffer()],
        program.programId,
      );

      await program.methods
        .claimStamp()
        .accountsPartial({
          travelerAccount: travelerPda,
          location: locationPda,
          stamp: stampPda,
          user: publicKey,
        })
        .rpc();

      console.log('Stamp claimed successfully');
      await fetchMyStamps();
    } catch (err) {
      console.error(err);
    } finally {
      setClaimingSlug(null);
    }
  }

  useEffect(() => {
    if (!publicKey) {
      setTravelerExists(null);
      setTraveler(null);
      return;
    }

    async function fetchTraveler() {
      const [travelerPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('traveler-profile'), publicKey!.toBuffer()],
        program.programId,
      );

      try {
        const account = await program.account.travelerData.fetch(travelerPda);

        setTraveler({
          authority: account.authority.toBase58(),
          name: account.name,
          age: account.age,
          country: account.country,
          numberOfPlacesVisited: account.numberOfPlacesVisited,
          createdAt: account.createdAt.toNumber(),
        });

        setTravelerExists(true);
      } catch (err) {
        console.log('Traveler not found', err);
        setTraveler(null);
        setTravelerExists(false);
      }
    }

    fetchTraveler();
    fetchMyStamps();
  }, [publicKey, program]);

  useEffect(() => {
    if (!scannerOpen) return;

    const scanner = new Html5QrcodeScanner(
      'reader',
      {
        fps: 10,
        qrbox: 250,
      },
      false,
    );

    scanner.render(
      async (decodedText) => {
        const qrText = decodedText;

        const url = new URL(qrText);
        const slug = url.searchParams.get('slug');

        claimStamp(slug!);

        await scanner.clear();
        setScannerOpen(false);
      },
      () => {},
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scannerOpen]);

  async function handleRegister(name: string, age: number, country: string) {
    if (!publicKey) return;

    setLoading(true);

    try {
      const [travelerPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('traveler-profile'), publicKey.toBuffer()],
        program.programId,
      );

      await program.methods
        .initializetraveler(name, age, country)
        .accountsPartial({
          user: publicKey,
        })
        .rpc();

      const account = await program.account.travelerData.fetch(travelerPda);

      setTraveler({
        authority: account.authority.toBase58(),
        name: account.name,
        age: account.age,
        country: account.country,
        numberOfPlacesVisited: account.numberOfPlacesVisited,
        createdAt: account.createdAt.toNumber(),
      });

      setTravelerExists(true);
      setShowRegisterModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <RegisterModal
          open={showRegisterModal}
          loading={loading}
          onClose={() => setShowRegisterModal(false)}
          onRegister={handleRegister}
        />

        <div className="w-full max-w-5xl">
          <div className="mb-8 gap-3 flex flex-col sm:flex-row items-center justify-center sm:items-center sm:justify-between  rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
            <div className="flex flex-col sm:flex gap-2">
              <h1 className="text-3xl font-bold text-white">🇧🇹 Druk Pass</h1>

              <p className="mt-1 text-zinc-400">
                Decentralized Traveller Passport
              </p>
            </div>

            <WalletMultiButton />
          </div>

          {!connected && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-12 text-center shadow-2xl">
              <h2 className="text-2xl font-bold text-white">
                Connect your wallet
              </h2>

              <p className="mt-3 text-zinc-400">
                Connect your Phantom wallet to continue.
              </p>
            </div>
          )}

          {connected && (
            <>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
                <p className="text-sm text-zinc-400">Connected Wallet</p>

                <p className="mt-2 break-all text-white">
                  {publicKey?.toBase58()}
                </p>
              </div>

              {travelerExists === null && (
                <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center">
                  <p className="text-lg text-zinc-400">
                    Checking traveller profile...
                  </p>
                </div>
              )}

              {travelerExists === false && (
                <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center shadow-xl">
                  <h2 className="text-3xl font-bold text-white">
                    Welcome Traveller 👋
                  </h2>

                  <p className="mt-4 text-zinc-400">
                    This wallet doesn't have a traveller passport yet.
                  </p>

                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="mt-8 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-500"
                  >
                    Register Traveller
                  </button>
                </div>
              )}

              {travelerExists === true && traveler && (
                <>
                  <div className="mt-8">
                    <TravelerProfile traveler={traveler} />
                  </div>
                </>
              )}
              {stamps &&
                stamps.map((stamp) => (
                  <div
                    key={stamp.slug}
                    className="mt-6 rounded-2xl border border-zinc-700 bg-zinc-900 p-5 shadow-lg"
                  >
                    <h3 className="text-xl font-bold text-white">
                      {stamp.name}
                    </h3>

                    <p className="mt-2 text-zinc-400">{stamp.district}</p>

                    <p className="mt-2 text-sm text-zinc-500">
                      {new Date(stamp.visitedAt * 1000).toLocaleString()}
                    </p>
                  </div>
                ))}
            </>
          )}
        </div>

        {/* Floating Scan Button */}
        <button
          onClick={() => setScannerOpen(true)}
          className="fixed bottom-8 right-8 rounded-full bg-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-2xl transition hover:bg-blue-500"
        >
          📷 Scan QR
        </button>
      </div>

      {/* Scanner Modal */}
      {scannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Scan QR Code</h2>

              <button
                onClick={() => setScannerOpen(false)}
                className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-500"
              >
                ✕
              </button>
            </div>

            <div
              id="reader"
              className="overflow-hidden rounded-2xl border border-zinc-700"
            />
          </div>
        </div>
      )}
    </>
  );
}
