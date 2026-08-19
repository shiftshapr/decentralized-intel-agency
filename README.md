# decentralizedintel.agency (DIA)

**Decentralized Intelligence Agency** – claims, evidence, and stacked signals in a free speech zone for open source investigators, internet researchers, and truth seekers.

Canonical repo path on the Meta-Layer VPS: `/home/ubuntu/decentralizedintel-agency`

## Stack

Same pattern as [nft.xowlz.com](https://nft.xowlz.com):

| Piece | Path / port |
| --- | --- |
| Static site | `public/` (nginx `root`) |
| WebP art | `assets/` → symlinked as `public/assets` |
| Express API | `api-server.js` on **127.0.0.1:4013**; nginx proxies `/api/*` |
| systemd | `decentralized-intel-site.service` |

Previously this domain proxied the full Canopi app. It now serves the DIA landing only. Use [app.canopi.live](https://app.canopi.live) for the main Canopi web app.

## Local dev

```bash
cp .env.example .env
npm install
npm run dev
```

## Deploy (Meta-Layer VPS)

**VPS IP:** `216.238.91.120`

### 1. Cloudflare DNS (user)

| Record | Type | Value | Proxy |
| --- | --- | --- | --- |
| `@` | A | `216.238.91.120` | Grey cloud (DNS only) for certbot |
| `www` | A | `216.238.91.120` | Grey cloud (DNS only) for certbot |

After Let's Encrypt cert is issued, you may re-enable orange cloud (proxied) if desired.

### 2. Deploy content + nginx + TLS (sudo on VPS)

```bash
bash /home/ubuntu/decentralizedintel-agency/deploy/scripts/deploy-www.sh
sudo bash /home/ubuntu/decentralizedintel-agency/deploy/scripts/apply-nginx-and-tls.sh
```

The apply script:

- Installs npm deps and checks the assets symlink
- Enables/restarts `decentralized-intel-site.service`
- Installs HTTP nginx vhost (with `listen 216.238.91.120:80` for IP-preview gotcha)
- Runs certbot webroot if no cert exists
- Switches to HTTPS vhost

### 3. Verify

```bash
curl -sI http://216.238.91.120/ -H 'Host: decentralizedintel.agency' | head -5
curl -sk https://decentralizedintel.agency/ | head -c 200
curl -sk https://decentralizedintel.agency/api/health
```

Expect HTTP 301 to HTTPS, HTML title "Decentralized Intelligence Agency", and `{"ok":true,...}` from `/api/health`.

## nginx configs

| File | Purpose |
| --- | --- |
| `deploy/nginx/decentralizedintel.agency.http-only.conf` | Bootstrap HTTP (certbot) |
| `deploy/nginx/decentralizedintel.agency.conf` | Full HTTP→HTTPS + TLS |

**Do not** add `listen 216.238.91.120:443` – it breaks SNI for other estate vhosts.

## Registry

Listed in `meta-console/registry.yaml` as `decentralizedintel-agency`.
