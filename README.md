# decentralized-intel-agency

**Canonical folder on disk:** `decentralizedintel-agency` (this repo). The empty `~/decentralized-intel` directory is not used — remove it if you like to avoid confusion.

[decentralizedintel.agency](https://decentralizedintel.agency) — **same stack as [nft.xowlz.com](https://nft.xowlz.com)**:

- **`public/`** — static files (NGINX `root`); `public/assets` → `../assets` (WebP art)
- **`api-server.js`** — Express on **127.0.0.1:4013**; NGINX proxies **`/api/*`**
- **`nginx/decentralizedintel.agency.conf`** — vhost
- **`install-nginx.sh`** — copy vhost and reload NGINX (`sudo`)
- **`decentralized-intel-site.service`** — systemd unit for the API (`sudo cp` → `/etc/systemd/system/`)

```bash
cp .env.example .env
npm install
npm run dev
```

TLS: `sudo certbot --nginx -d decentralizedintel.agency -d www.decentralizedintel.agency`

**Note:** This domain previously proxied the full Canopi app. It now matches the xowlz-style static+API layout. Use [app.canopi.live](https://app.canopi.live) for the main Canopi web app.
