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
- **GET /posts/:id**: Poszt lekérdezése az id alapján
- **DELETE /posts/:id**: Poszt törlése
- **PUT /posts/:id**: Poszt módosítása 
- **GET /users**: Összes felhasználó lekérdezése
- **POST /users**: Új felhasználó létrehozása
- **GET /users/:id** Felhasználó lekérdezése id  alapján
- **DELETE /users/:id** Felhasználó törlése
- **PUT /users/:id** Felhasználó módosítása
- **GET /users/:id/posts** Egy felhasználó posztjainak lekérdezése

## Licenc
MIT Licenc.