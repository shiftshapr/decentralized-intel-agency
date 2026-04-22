# decentralized-intel-agency

Infrastructure for [decentralizedintel.agency](https://decentralizedintel.agency): NGINX vhost and install script. The live site is the Canopi app on the host (same upstream as `app.canopi.live`).

- `nginx/decentralizedintel.agency.conf` — vhost definition
- `install-nginx.sh` — copy to `/etc/nginx` and reload (run with `sudo`)

TLS: after DNS points at the server, `sudo certbot --nginx -d decentralizedintel.agency -d www.decentralizedintel.agency`
