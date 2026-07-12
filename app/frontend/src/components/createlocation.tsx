import { useState } from 'react';

interface CreateLocationFormProps {
  loading?: boolean;
  onSubmit: (data: { slug: string; name: string; district: string }) => void;
}

const districts = [
  'Bumthang',
  'Chhukha',
  'Dagana',
  'Gasa',
  'Haa',
  'Lhuentse',
  'Mongar',
  'Paro',
  'Pema Gatshel',
  'Punakha',
  'Samdrup Jongkhar',
  'Samtse',
  'Sarpang',
  'Thimphu',
  'Trashigang',
  'Trashi Yangtse',
  'Trongsa',
  'Tsirang',
  'Wangdue Phodrang',
  'Zhemgang',
];

export default function CreateLocationForm({
  loading = false,
  onSubmit,
}: CreateLocationFormProps) {
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSubmit({
      slug,
      name,
      district,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
    >
      <h2 className="text-2xl font-bold text-white">Create Location</h2>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Slug
        </label>

        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="tigers-nest"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tiger's Nest Monastery"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          District
        </label>

        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
        >
          <option value="">Select District</option>

          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
      >
        {loading ? 'Creating...' : 'Create Location'}
      </button>
    </form>
  );
}
