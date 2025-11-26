# Jedligram Projekt

## Leírás
A Jedligram egy Node.js alapú backend alkalmazás, amely lehetővé teszi posztok és felhasználók kezelését MongoDB adatbázis segítségével.

## Főbb funkciók
- Posztok létrehozása, lekérdezése, módosítása és törlése.
- Felhasználók létrehozása, lekérdezése, módosítása és törlése.
- Adatellenőrzés Mongoose sémák használatával.
- Tesztelés Jest keretrendszerrel.

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