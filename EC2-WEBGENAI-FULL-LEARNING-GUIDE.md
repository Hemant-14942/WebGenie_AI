# EC2 + Docker: full learning guide (WebGenAI / this repo)

This document is tailored to **your EC2 layout** and everything we discussed in chat: **why** each step exists, **what broke** or could break, and **how** we fixed or avoided it.

**Your paths (use exactly on EC2):**

| Role | Path |
|------|------|
| Repo root (where `.git` lives — `git pull` yahan) | `~/app/webgenai` **or** `~/app/webgenai/ai-website-builder` |
| Docker & `.env` (always `docker compose` yahan) | `<REPO_ROOT>/server` |

Agar tumne clone karte waqt folder name `ai-website-builder` rakha hai **andar** `webgenai` ke:

```bash
export REPO_ROOT=~/app/webgenai/ai-website-builder
```

Agar poora monorepo **direct** `~/app/webgenai` pe clone hai (repo root = `webgenai`):

```bash
export REPO_ROOT=~/app/webgenai
```

Neeche commands mein `$REPO_ROOT` use karo; pehle ek baar `export REPO_ROOT=...` set kar lo.

---

## Part A — Mental model (shuru se samajh)

### A1. Do pieces: frontend vs API

- **`client/`** — Next.js. Usually **Vercel** (browser se chalega). EC2 pe is folder ko run karne ki zaroorat nahi jab sirf API EC2 pe ho.
- **`server/`** — Express + Mongo + Stripe webhook + OpenRouter. **Yahi Docker** se EC2 pe chalta hai.

**Why this split:** Browser ko static/SSR frontend alag URL se milega (Vercel), API alag origin se (`https://api...` ya `http://EC2_IP`). Isliye **CORS** aur **cookies (`domain`)** important hain.

### A2. Docker compose mein do containers

`server/docker-compose.yml`:

1. **`server`** — Node app, **port 5000** (Docker network ke andar; bahar expose sirf compose ke hisaab se).
2. **`nginx`** — Host pe **port 80** map; andar se `http://server:5000` ko proxy karta hai.

**Why nginx, direct Node kyun nahi port 80 pe?**

- Baad mein **SSL termination**, **rate limits**, **static files** add karna aasaan.
- Node ko root port bind karwane ki zaroorat nahi.
- `Dockerfile` mein `EXPOSE 5000` — nginx config bhi `proxy_pass http://server:5000/api/;` use karti hai (`server` = service name = internal DNS).

**Problem we avoided:** Agar nginx aur Express **dono** CORS headers bhej dein to browser **duplicate header** se confuse ho sakta hai. Isliye `server/nginx/default.conf` mein likha hai: CORS sirf Express karega; nginx sirf proxy.

### A3. Git vs Docker — alag folders

- **`git pull`** → **repo root** (`$REPO_ROOT`, jahan `.git` hai).
- **`docker compose`** → **`$REPO_ROOT/server`** (jahan `docker-compose.yml` hai).

**Why:** Git poora monorepo track karta hai; Docker sirf `server/` context se image build karta hai (`context: .` = `server/` directory).

---

## Part B — EC2 pe pehli baar (host setup)

### B1. OS update + Git

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git
```

**Why:** Stable packages; clone/pull ke liye Git.

### B2. Docker Engine + Compose plugin

Ubuntu ke liye official Docker repo se install karna best hai (version pinned, `docker compose` V2).

```bash
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Docker bina `sudo` ke chalane ke liye (logout/login zaroori):

```bash
sudo usermod -aG docker $USER
```

Verify:

```bash
docker --version
docker compose version
```

**Problem people face:** `docker: permission denied` → user `docker` group mein nahi ya session purana hai → **logout/login** ya `newgrp docker`.

---

## Part C — Repo clone + tumhara exact path

### C1. Pehli baar clone (example: repo `webgenai` folder ke andar)

```bash
mkdir -p ~/app/webgenai
cd ~/app/webgenai
git clone <YOUR_REPO_URL> ai-website-builder
export REPO_ROOT=~/app/webgenai/ai-website-builder
cd "$REPO_ROOT/server"
```

### C2. `.env` banana (secrets kabhi git mein mat daalna)

```bash
cd "$REPO_ROOT/server"
cp .env.example .env
nano .env   # ya vim
```

**Why `.env` server pe:** `docker-compose.yml` mein `env_file: - ./.env` — container ko ye values milti hain.

**Zod-required keys** (`server/src/config/env.ts`): `PORT`, `MONGO_URI`, `DB_NAME`, `JWT_SECRET`, `IN_PROD`, `OPENAI_API_KEY`, `OPENAI_MODEL`, optional `CORS_ORIGINS`.

**Extra (code `process.env` se leta hai, Zod list mein nahi):** `DEPLOYMENT_URL`, Stripe keys, success/cancel URLs — inhe bhi prod mein set karna.

**Problem we discussed:** `PORT` schema default **3000** hai lekin Dockerfile/nginx **5000** expect karte hain — **`.env` mein `PORT=5000` explicit rakho** taaki mismatch na ho.

**Problem we discussed:** `IN_PROD` agar `z.coerce.boolean()` se parse ho raha ho to kabhi-kabhi string `"false"` bhi **true** ban sakti hai — prod cookies (`secure`, `domain`) galat ho sakte hain. **EC2 prod mein `IN_PROD=true` verify karo** (behavior dekh kar).

---

## Part D — Build & run (exact commands)

```bash
cd "$REPO_ROOT/server"
docker compose build
docker compose up -d
docker compose ps
```

Logs:

```bash
docker compose logs -f server
docker compose logs -f nginx
```

**Har deploy ke baad (code update):**

```bash
cd "$REPO_ROOT"
git pull
cd server
docker compose up -d --build
```

**Why `--build`:** Naya image banao warna purana cached image chalta rahega.

**Problem:** Containers purane code se chal rahe hain → **`docker compose up -d --build`** ya `build` phir `up`.

---

## Part E — AWS Security Group + firewall

EC2 **Security Group** inbound:

- **22** — SSH (ideal: sirf tumhara IP)
- **80** — HTTP (`docker-compose.yml`: `"80:80"` nginx ke liye)
- **443** — jab SSL laga doge (Stripe **live** webhook ke liye HTTPS almost mandatory)

Host pe `ufw` ho to:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

**Problem:** Browser se API call fail, curl EC2 se pass → aksar **SG mein 80/443 band** ya galat IP.

---

## Part F — Health checks (nginx → Express)

Nginx `/health` ko backend `/api/health` pe forward karta hai.

```bash
curl -s http://127.0.0.1/health
curl -s http://127.0.0.1/api/health
```

Laptop se:

```bash
curl -s http://<EC2_PUBLIC_IP>/health
```

**Problem:** Browser mein “CORS error” lekin status **502/504** — asal mein **nginx Node tak nahi pahuncha**; sirf “CORS” dikh raha hai. **`docker compose logs nginx`** aur **`server`** dekho.

---

## Part G — CORS + frontend origins

Express `server/src/index.ts` mein **allowed origins** ki list + `CORS_ORIGINS` env (comma-separated).

**Why:** Browser Vercel se (`https://web-genie-ai.vercel.app` etc.) API ko call karta hai — origin allow nahi hua to **preflight fail**.

**Problem:** Naya preview URL / custom domain → list mein nahi → **`CORS_ORIGINS`** mein add karo aur **container restart** / redeploy.

---

## Part H — Cookies (auth token)

`server/src/utils/cookies.ts`: prod mein `secure: true`, `domain: ".itshemant.me"` (tumhare domain ke hisaab se).

**Why `domain`:** `app.` aur `api.` same parent domain pe cookie share ho sake.

**Problem:** API agar alag naked domain / IP pe ho aur frontend `app.x.com` pe ho to **cookie set hone ke baad bhi next request mein nahi jayegi** — domain / SameSite / HTTPS mismatch. **Design:** frontend URL + API URL + cookie domain **ek hi strategy** se align hon.

---

## Part I — Stripe (chat se: jo issues aaye the)

### I1. Webhook route **pehle**, `express.json()` **baad mein**

`server/src/index.ts` mein:

```text
POST /api/stripe/webhook  →  express.raw({ type: "application/json" })
phir
app.use(express.json())
```

**Why:** Stripe signature `constructEvent` ke liye **raw body** chahiye. Agar pehle `express.json()` chal jaye to body parse ho chuki hoti hai → **signature verify fail**.

**Problem we tackled:** Webhook 400 / “Invalid signature” — order galat tha ya body JSON parse ho chuki thi.

### I2. Webhook handler Express `Request` use kare

**Why:** `req.body` Buffer vs parsed object — types/runtime dono Express ke hisaab se.

### I3. Plan metadata validate karo

Checkout `metadata` mein `plan` sirf allowed values ho; DB update se pehle check.

**Why:** Galat/empty `plan` se `$set` dangerous values na jaye.

### I4. Idempotency (Stripe retries)

Same `event.id` dobara aaye to duplicate credits na badhe — Mongo mein unique `stripeEventId`.

**Problem:** Stripe same event retry karta hai → **double credits** bina idempotency ke.

### I5. URLs Stripe dashboard + env

- **Webhook URL:** `https://<public-api-host>/api/stripe/webhook`  
  Nginx `/api/` → Node `/api/...` isliye path **same** rehta hai.

Local test:

```bash
stripe listen --forward-to localhost:5000/api/stripe/webhook
```

**Problem:** `payments.controller.ts` top-level `new Stripe(process.env.STRIPE_SECRET_KEY)` — agar key missing ho to **process crash** ho sakta hai deploy pe. EC2 `.env` mein Stripe keys **set** rakho ya code mein optional init (future hardening).

---

## Part J — Deployed “sites” URL (`DEPLOYMENT_URL`)

`websiteBuilder` deploy flow `process.env.DEPLOYMENT_URL` use karta hai (fallback localhost — **prod mein galat**).

**Problem:** User ko live link `http://localhost:3000/sites/...` mil jaye agar env na ho.

**Fix:** EC2 `.env` mein **`DEPLOYMENT_URL=https://<your-frontend>/sites`** (trailing slash consistency — code normalize karta hai).

---

## Part K — Quick copy-paste card (tumhari paths)

```bash
# 1) Har session / script start — apna actual path set karo
export REPO_ROOT=~/app/webgenai/ai-website-builder   # ya ~/app/webgenai

# 2) Code update
cd "$REPO_ROOT" && git pull

# 3) Rebuild API
cd "$REPO_ROOT/server" && docker compose up -d --build

# 4) Health
curl -s http://127.0.0.1/health
```

---

## Part L — Files tum kab touch karte ho

| Situation | File |
|-----------|------|
| CORS / new frontend URL | `server/src/index.ts` + optional `CORS_ORIGINS` |
| Reverse proxy / health | `server/nginx/default.conf` |
| Ports / services | `server/docker-compose.yml` |
| Env validation | `server/src/config/env.ts` |
| Stripe webhook order | `server/src/index.ts` |
| Cookie domain | `server/src/utils/cookies.ts` |

---

## Part M — `AWS-EC2-DEPLOY-NOTES.txt` se farq

- **`AWS-EC2-DEPLOY-NOTES.txt`** — chhota cheat sheet (commands only).
- **`EC2-WEBGENAI-FULL-LEARNING-GUIDE.md`** (ye file) — **kyun + kya problem aaya + kaise tackle** + **tumhara `~/app/webgenai` path**.

Dono ko root folder mein rakha hai taaki future mein turant mil jaye.

---

*Last aligned with repo: Express API under `server/`, nginx proxy on host port 80, Stripe webhook before JSON parser, health under `/api/health`.*
