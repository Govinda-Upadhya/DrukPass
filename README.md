# 🇧🇹 DrukPass

DrukPass is a decentralized digital travel passport built on the Solana blockchain. It allows travelers to collect digital stamps as proof of visiting different locations across Bhutan.

Instead of carrying a physical passport or booklet, travelers simply connect their Solana wallet and scan QR codes available at participating tourist destinations. Each successful scan permanently records a unique stamp on-chain, creating an immutable travel history that belongs entirely to the traveler.

## ✨ Features

- 🔐 Wallet-based authentication using Solana Wallet Adapter
- 📍 Register as a traveler
- 📷 Claim location stamps by scanning QR codes
- ⛓️ On-chain storage of travel records using an Anchor smart contract
- 🗺️ View all collected travel stamps
- 👤 Traveler profile with visited locations count

---

# 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Solana Wallet Adapter
- html5-qrcode

### Blockchain

- Solana
- Anchor Framework
- Rust

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/Govinda-Upadhya/DrukPass.git
cd DrukPass
```

---

## 2. Install the frontend

```bash
cd app
npm install
```

or

```bash
bun install
```

---


## 3. Start the frontend

```bash
npm run dev
```

or

```bash
bun run dev
```

The application will be available at:

```
http://localhost:5173
```

---

# ⚓ Running the Anchor Program

From the project root:

Build the program:

```bash
anchor build
```

Deploy to your validator or Devnet:

```bash
anchor deploy
```

---

# 📱 How It Works

1. Connect your Solana wallet.
2. Register as a traveler.
3. Visit a supported tourist destination.
4. Scan the location QR code.
5. Receive a permanent on-chain travel stamp.
6. View all collected stamps in your digital passport.

## 🛠️ Admin Configuration

By default, the program contains a hardcoded administrator wallet that is authorized to register new locations.

If you are deploying your own instance of DrukPass, replace the `ADMIN` constant in the Anchor program with your own wallet's public key:

```rust
pub const ADMIN: Pubkey = pubkey!("YOUR_PUBLIC_KEY");
```

After updating the admin wallet, rebuild and redeploy the program:

```bash
anchor build
anchor deploy
```

You should also update the Program ID used by the frontend if you deploy a new instance of the smart contract.

---

## 📍 Registering Locations

Once you are the admin, navigate to:

```
/admin
```

From there you can register a new tourist location by providing:

- Slug
- Location name
- District

For each registered location, create a QR code that points to:

```
https://drukpass.app/claim?slug=<location-slug>
```

Example:

```
https://drukpass.app/claim?slug=tiger-nest
```

You can generate the QR code using any online QR code generator and place it at the tourist destination.
---

# 📂 Project Structure

```
DrukPass/
│
├── app/                 # React frontend
├── programs/            # Anchor program
├── migrations/
├── Anchor.toml
└── Cargo.toml
```

---

# 📄 License

This project is licensed under the MIT License.
