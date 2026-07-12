interface Traveler {
  authority: string;
  name: string;
  age: number;
  country: string;
  numberOfPlacesVisited: number;
  createdAt: number;
}

interface TravelerProfileProps {
  traveler: Traveler;
}

export default function TravelerProfile({
  traveler,
}: TravelerProfileProps) {
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden">

      <div className="bg-gradient-to-r from-blue-700 to-cyan-500 p-8">
        <h1 className="text-4xl font-bold text-white">
          🇧🇹 Druk Pass
        </h1>

        <p className="mt-2 text-blue-100">
          Decentralized Traveller Passport
        </p>
      </div>

      <div className="p-8">

        <div className="flex gap-8 items-center">

          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-blue-600 text-5xl font-bold text-white">
            {traveler.name[0].toUpperCase()}
          </div>

          <div>

            <h2 className="text-3xl font-bold text-white">
              {traveler.name}
            </h2>

            <p className="mt-2 text-zinc-400">
              {traveler.country}
            </p>

            <span className="mt-4 inline-block rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white">
              Active Passport
            </span>

          </div>

        </div>

        <div className="mt-10 grid grid-cols-2 gap-6">

          <InfoCard
            title="Age"
            value={traveler.age.toString()}
          />

          <InfoCard
            title="Country"
            value={traveler.country}
          />

          <InfoCard
            title="Places Visited"
            value={traveler.numberOfPlacesVisited.toString()}
          />

          <InfoCard
            title="Member Since"
            value={new Date(
              traveler.createdAt * 1000
            ).toLocaleDateString()}
          />

        </div>

        <div className="mt-10">

          <p className="mb-2 text-sm text-zinc-400">
            Wallet Address
          </p>

          <div className="rounded-xl bg-zinc-950 p-4 break-all text-zinc-300">
            {traveler.authority}
          </div>

        </div>

      </div>
    </div>
  );
}

interface InfoCardProps {
  title: string;
  value: string;
}

function InfoCard({ title, value }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">

      <p className="text-sm text-zinc-400">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-white">
        {value}
      </p>

    </div>
  );
}