# Jedligram Projekt

## Leírás
A Jedligram egy Node.js alapú backend alkalmazás, amely lehetővé teszi posztok és felhasználók kezelését MongoDB adatbázis segítségével.

## Főbb funkciók
- Posztok létrehozása, lekérdezése, módosítása és törlése.
- Felhasználók létrehozása, lekérdezése, módosítása és törlése.
- Adatellenőrzés Mongoose sémák használatával.
- Tesztelés Jest keretrendszerrel.

## Telepítés
1. Klónozd a repót:
   ```bash
   git clone https://github.com/Geher-Marcell/jedligram_projekt_testing_mongodb_sg_13a_ccsoport_jest_backend_nodejs_alkalmazas.git
   ```
2. Lépj be a mappába:
   ```bash
   cd jedligram_projekt_testing_mongodb_sg_13a_ccsoport_jest_backend_nodejs_alkalmazas
   ```
3. Telepítsd a függőségeket:
   ```bash
   npm install
   ```

## Használat
1. Hozz létre egy `.env` fájlt ezzel a tartalommal:
   ```
   MONGO_URI=<mongodb-címed>
   PORT=3000
   ```
2. Indítsd el a szervert:
   ```bash
   npm start
   ```
   Az alkalmazás elérhető lesz a `http://localhost:3000` címen.

## Tesztelés
Futtasd a teszteket:
```bash
npm test
```

## API Végpontok
- **GET /posts**: Összes poszt lekérdezése
- **POST /posts**: Új poszt létrehozása
- **GET /users**: Összes felhasználó lekérdezése

## Licenc
MIT Licenc.