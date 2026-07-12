import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { useProgram } from '../hook/useProgram';
import CreateLocationForm from '../components/createlocation';

interface Location {
  slug: string;
  name: string;
  district: string;
}
('node');
export default function Admin() {
  const { program } = useProgram();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [locations, setLocations] = useState<Location[]>([]);
  async function fetchLocations() {
    try {
      const accounts = await program.account.location.all();

      setLocations(
        accounts.map((account) => ({
          slug: account.account.slug,
          name: account.account.name,
          district: account.account.district,
        })),
      );
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    fetchLocations();
  }, [program]);
  async function onSubmit(location: Location) {
    setLoading(true);

    try {
      const [locationPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('location'), Buffer.from(location.slug)],
        program.programId,
      );

      await program.methods
        .initializelocation(location.slug, location.name, location.district)
        .accountsPartial({
          location: locationPda,
        })
        .rpc();

      await fetchLocations();
      setShowModal(false);
    } catch (err) {
      console.error('Failed to create location:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-white">
              📍 Location Management
            </h1>

            <p className="mt-1 text-zinc-400">
              Manage tourist destinations in Bhutan.
            </p>
          </div>

          <button
            disabled={loading}
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Submitting...' : '+ Add Location'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl p-8">
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl">
          <table className="w-full">
            <thead className="border-b border-zinc-800 bg-zinc-950">
              <tr>
                <th className="px-6 py-4 text-left text-zinc-400">Name</th>

                <th className="px-6 py-4 text-left text-zinc-400">Slug</th>

                <th className="px-6 py-4 text-left text-zinc-400">District</th>
              </tr>
            </thead>

            <tbody>
              {locations.map((location) => (
                <tr
                  key={location.slug}
                  className="border-b border-zinc-800 transition hover:bg-zinc-800/40"
                >
                  <td className="px-6 py-5 font-medium text-white">
                    {location.name}
                  </td>

                  <td className="px-6 py-5 text-zinc-400">{location.slug}</td>

                  <td className="px-6 py-5">
                    <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm font-medium text-blue-400">
                      {location.district}
                    </span>
                  </td>
                </tr>
              ))}

              {locations.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-20 text-center text-zinc-500">
                    No locations have been added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => {
            if (!loading) {
              setShowModal(false);
            }
          }}
        >
          <div
            className="relative w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              disabled={loading}
              onClick={() => setShowModal(false)}
              className="absolute right-5 top-5 z-10 text-3xl text-zinc-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              ×
            </button>

            <CreateLocationForm loading={loading} onSubmit={onSubmit} />
          </div>
        </div>
      )}
    </div>
  );
}
