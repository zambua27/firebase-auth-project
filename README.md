# Firebase Authentication — тіркеу және авторизациялау жүйесі

## Іске қосу

1. https://console.firebase.google.com → **Add project** → жоба құру.
2. **Build → Authentication → Get started → Sign-in method**:
   - **Email/Password** — Enable
   - **Google** — Enable (support email таңдаңыз)
3. **Project settings → General → Your apps → Web (</>)** → қосымшаны тіркеу.
   Шыққан `firebaseConfig` мәндерін `js/firebase-config.js` файлына қойыңыз.
4. Жобаны жергілікті серверде ашыңыз (ES-модульдер `file://` арқылы жұмыс істемейді):
   - VS Code → **Live Server** кеңейтімі → `index.html` → *Open with Live Server*, немесе
   - `python -m http.server 8000` → http://localhost:8000
5. (Қосымша) Интернетке жариялау: `npm i -g firebase-tools` → `firebase login` →
   `firebase init hosting` → `firebase deploy`. Жариялағаннан кейін домен
   **Authentication → Settings → Authorized domains** тізімінде болуы керек.

## Құрылымы

```
index.html          — кіру беті
register.html       — тіркелу беті
reset.html          — құпиясөзді қалпына келтіру
dashboard.html      — жеке кабинет (қорғалған бет)
css/style.css       — стильдер
js/firebase-config.js — Firebase баптаулары
js/auth.js          — авторизация логикасы
```
