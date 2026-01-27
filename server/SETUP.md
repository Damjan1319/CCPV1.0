# Backend Setup Instructions

## 1. Instalacija Dependencies

```bash
cd server
npm install
```

## 2. Konfiguracija Email-a

Kreirajte `.env` fajl u `server/` folderu:

```env
PORT=3001
NODE_ENV=development

# Database
DB_PATH=./database.sqlite

# JWT Secret (generate a random string)
JWT_SECRET=your-random-secret-key-here
JWT_EXPIRES_IN=7d

# Email Configuration
# Za Gmail, koristite App Password (ne vaš regularni password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=CCP <your-email@gmail.com>
```

### Gmail Setup:

1. Idite na Google Account → Security
2. Uključite 2-Step Verification
3. Generišite App Password:
   - Idite na App passwords
   - Izaberite "Mail" i "Other (Custom name)"
   - Unesite "CCP" kao ime
   - Kopirajte generisani password u `SMTP_PASS`

### Alternativa (bez email-a za development):

Ako ne želite da konfigurišete email sada, aplikacija će raditi ali će samo logovati password u konzoli umesto slanja email-a.

## 3. Pokretanje Servera

```bash
npm run dev
```

Server će biti dostupan na `http://localhost:3001`

## 4. Database

Database se automatski kreira pri prvom pokretanju u `database.sqlite` fajlu.

## 5. Alert Checker

Alert checker se automatski pokreće svakih 6 sati. Možete ga ručno pokrenuti:

```bash
node alert-checker.js
```

## 6. Produkcija

Za produkciju:

1. Promenite `JWT_SECRET` na jaku random vrednost
2. Konfigurišite email servis (Gmail, SendGrid, Mailgun, etc.)
3. Koristite PostgreSQL ili MySQL umesto SQLite za veće projekte
4. Postavite environment variables na serveru
5. Koristite PM2 ili systemd za process management
6. Postavite cron job za alert checking

## API Endpoints

- `POST /api/auth/register` - Registracija (samo email)
- `POST /api/auth/login` - Login (email + password)
- `POST /api/auth/change-password` - Promena password-a (zahteva auth)
- `GET /api/alerts` - Lista alertova korisnika (zahteva auth)
- `POST /api/alerts` - Kreiranje alerta (zahteva auth)
- `DELETE /api/alerts/:id` - Brisanje alerta (zahteva auth)
- `POST /api/search` - Pretraga proizvoda
