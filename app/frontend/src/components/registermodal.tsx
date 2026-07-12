import { useState } from 'react';

interface RegisterModalProps {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onRegister: (name: string, age: number, country: string) => Promise<void>;
}

export default function RegisterModal({
  open,
  loading = false,
  onClose,
  onRegister,
}: RegisterModalProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !age || !country) {
      alert('Please fill all fields.');
      return;
    }

    await onRegister(name.trim(), Number(age), country.trim());

    setName('');
    setAge('');
    setCountry('');

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white">Register Traveller</h2>

        <p className="mt-2 text-sm text-zinc-400">
          Create your digital passport to begin collecting travel stamps.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Name</label>

            <input
              type="text"
              value={name}
              maxLength={50}
              onChange={(e) => setName(e.target.value)}
              placeholder="Govinda Upadhya"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Age</label>

            <input
              type="number"
              min={1}
              max={149}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="22"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Country</label>

            <input
              type="text"
              value={country}
              maxLength={50}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Bhutan"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-700 px-5 py-3 text-zinc-300 transition hover:bg-zinc-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register Traveller'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
