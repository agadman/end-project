# Meny-API – Slutprojekt Backend-baserad webbutveckling
Detta repository innehåller ett REST API byggt med Express och MongoDB. API:et är ett slutprojekt i kursen Backend-baserad webbutveckling vid Mittuniversitetet och hanterar menyinformation för en fiktiv restaurang. Grundläggande CRUD-funktionalitet samt användarautentisering med JWT är implementerad.

## Länk
En liveversion av API:et finns tillgänglig på följande URL: 
https://end-project.onrender.com/api/menu

Observera att man behöver vara inloggad för att kunna hantera menyn.

## Installation, databas
API:et använder en MongoDB-databas.  Klona ner källkodsfilerna, kör kommando npm install för att installera nödvändiga npm-paket.

Skapa en .env-fil i projektroten med följande innehåll:
PORT=3000
DATABASE=mongodb+srv://<användare>:<lösenord>@<kluster>.mongodb.net/<databasnamn>?retryWrites=true&w=majority
JWT_SECRET_KEY=dinHemligaNyckel

Starta servern genom att köra kommando: npm run serve

### Databasschema

#### users
| Fält      | Typ    | Beskrivning        |
|-----------|--------|--------------------|
| username  | string | Unikt användarnamn |
| password  | string | Hashat lösenord    |
| created   | date   | Skapande datum     |

#### menuitems
| Fält         | Typ    | Beskrivning                      |
|--------------|--------|----------------------------------|
| name         | string | Namn på rätten                   |
| description  | string | Beskrivning av rätten            |
| price        | number | Pris i SEK                       |
| category     | string | Kategori: starter, main, dessert |

## Användning
API:et använder följande endpoints:

### Autentisering
| Metod | Ändpunkt      | Beskrivning                                        |
|-------|---------------|----------------------------------------------------|
| POST  | /api/register | Registrerar ny användare med username och password |
| POST  | /api/login    | Loggar in oc returnerar JWT-token                  |

### Meny 
| Metod  | Ändpunkt      | Beskrivning                                      |
|--------|---------------|--------------------------------------------------|
| GET    | /api/menu     | Hämtar alla menyobjekt, publikt                  |
| POST   | /api/menu     | Lägger till nytt menyobjekt, kräver token        |
| PUT    | /api/menu/:id | Uppdaterar menyobjekt med givet ID, kräver token |
| DELETE | /api/menu/:id | Tar bort menyobjekt med givet ID, kröver token   |

### Ett menyobjekt returneras/skickas som JSON med följande struktur:
{
  "name": "Margherita",
  "description": "Klassisk pizza med tomatsås, mozzarella och basilika",
  "price": 95,
  "category": "main"
}