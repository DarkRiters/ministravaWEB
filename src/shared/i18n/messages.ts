export const messages = {
    pl: {
        // =====================
        // COMMON – ACTIONS / STATES / CONFIRMS (NEW)
        // =====================
        "common.actions.refresh": "Odśwież",
        "common.actions.resetFilters": "Reset filtrów",
        "common.actions.delete": "Usuń",
        "common.actions.close": "Zamknij",
        "common.actions.back": "Wróć",

        "common.states.loading": "Ładowanie...",
        "common.states.noResults": "Brak wyników.",
        "common.states.noData": "Brak danych.",

        "common.confirm.deleteActivity": "Usunąć aktywność?",
        "common.confirm.deleteUser": "Usunąć użytkownika?",

        // =====================
        // ADMIN – ACTIVITIES (NEW)
        // =====================
        "admin.activities.title": "Aktywności",
        "admin.activities.subtitle": "Filtry działają na całej wczytanej liście.",
        "admin.activities.loaded": "Wczytano: {loaded}",
        "admin.activities.filtered": "Wyniki po filtrach: {filtered}",

        "admin.activities.filters.searchPlaceholder": "Szukaj (nazwa, email, notatka...)",
        "admin.activities.filters.userAll": "Użytkownik: wszyscy",
        "admin.activities.filters.typeAll": "Typ: wszystkie",
        "admin.activities.filters.dateFrom": "Data od",
        "admin.activities.filters.dateTo": "Data do",
        "admin.activities.filters.distanceMin": "Dystans min",
        "admin.activities.filters.distanceMax": "Dystans max",
        "admin.activities.filters.timeMin": "Czas min",
        "admin.activities.filters.timeMax": "Czas max",

        "admin.activities.table.id": "ID",
        "admin.activities.table.user": "Użytkownik",
        "admin.activities.table.name": "Nazwa",
        "admin.activities.table.type": "Typ",
        "admin.activities.table.distance": "Dystans",
        "admin.activities.table.time": "Czas",
        "admin.activities.table.date": "Data",
        "admin.activities.table.actions": "Akcje",

        "admin.activities.errors.fetch": "Nie udało się pobrać aktywności.",
        "admin.activities.errors.delete": "Nie udało się usunąć.",

        // =====================
        // ADMIN – STATS (NEW)
        // =====================
        "admin.stats.title": "Statystyki globalne",
        "admin.stats.subtitle": "Podsumowanie całej aplikacji.",
        "admin.stats.cards.users": "Użytkownicy",
        "admin.stats.cards.activities": "Aktywności",
        "admin.stats.cards.totalDistance": "Łączny dystans",
        "admin.stats.cards.totalTime": "Łączny czas",
        "admin.stats.rawValue": "surowo: {value}",
        "admin.stats.errors.fetch": "Nie udało się pobrać statystyk.",

        // =====================
        // ADMIN – USERS (EXTENSION / CLEANUP)
        // =====================
        "admin.users.total": "{count} użytkowników",
        "admin.users.empty": "Brak danych",

        // Field labels (NEW)
        "admin.fields.first_name": "Imię",
        "admin.fields.last_name": "Nazwisko",
        "admin.fields.birth_date": "Data urodzenia",
        "admin.fields.gender": "Płeć",
        "admin.fields.height": "Wzrost",
        "admin.fields.weight": "Waga",
        "admin.fields.avatar": "Avatar",
        "admin.fields.created_at": "Utworzono",
        "admin.fields.updated_at": "Zaktualizowano",

        // Notes (NEW)
        "admin.users.emailNoChangeHint":
            "Jeśli email zostaje taki sam, nie wysyłamy go do API (żeby nie dostać błędu unique).",
        // =====================
        // ADMIN – NAV (NEW)
        // =====================
        "admin.panel.title": "Panel administratora",
        "admin.panel.open": "Panel administratora",
        "admin.panel.noAccess": "Brak dostępu do panelu administratora.",

        "admin.nav.dashboard": "Statystyki",
        "admin.nav.dashboardDesc": "Globalne statystyki systemu",

        "admin.nav.users": "Użytkownicy",
        "admin.nav.usersDesc": "Lista, edycja, usuwanie",

        "admin.nav.activities": "Aktywności",
        "admin.nav.activitiesDesc": "Filtry, wyszukiwanie, usuwanie",
        // =====================
        // SETTINGS - THEME
        // =====================
        "settings.theme.title": "Motyw",
        "settings.theme.light": "Jasny",
        "settings.theme.dark": "Ciemny",

        // =====================
        // SETTINGS - LOCALE
        // =====================
        "settings.locale.title": "Język",
        "settings.locale.pl": "PL",
        "settings.locale.en": "EN",

        // =====================
        // SETTINGS - PROFILE
        // =====================
        "settings.profile.title": "Profil",
        "settings.profile.open": "Otwórz profil",
        "settings.profile.save": "Zapisz profil",
        "settings.profile.saveName": "Zapisz nazwę",
        "settings.profile.saveEmail": "Zapisz email",
        "settings.profile.noChanges": "Brak zmian do zapisania.",
        "settings.profile.emailRequired": "Email jest wymagany.",

        // ✅ PROFILE – EXTRA (NEW)
        "settings.profile.refreshSuccess": "Profil odświeżony.",
        "settings.profile.saveSuccess": "Profil zapisany.",
        "settings.profile.nameRequired": "Nazwa jest wymagana.",
        "settings.profile.refreshError": "Nie udało się odświeżyć profilu.",
        "settings.profile.saveError": "Nie udało się zapisać profilu.",

        // ✅ PASSWORD (NEW)
        "settings.password.title": "Zmiana hasła",
        "settings.password.current": "Aktualne hasło",
        "settings.password.new": "Nowe hasło",
        "settings.password.confirm": "Powtórz nowe hasło",
        "settings.password.submit": "Zaktualizuj hasło",
        "settings.password.success": "Hasło zostało zaktualizowane.",
        "settings.password.error": "Nie udało się zaktualizować hasła.",

        // ✅ FITNESS PROFILE (NEW)
        "settings.fitness.title": "Profil fitness (lokalnie)",
        "settings.fitness.reset": "Resetuj",
        "settings.fitness.info":
            "Te wartości są przechowywane lokalnie i używane do szacowania kalorii w treningach.",
        "settings.fitness.weight": "Waga (kg)",
        "settings.fitness.height": "Wzrost (cm)",
        "settings.fitness.age": "Wiek",
        "settings.fitness.save": "Zapisz profil fitness",
        "settings.fitness.currentValues": "Aktualne wartości:",

        // =====================
        // USER PANEL
        // =====================
        "userPanel.greeting.noName": "Witaj!",
        "userPanel.greeting.withName": "Witaj {name}!",
        "userPanel.actionsHint": "(Wyloguj / profil)",
        "userPanel.login": "Zaloguj się",
        "userPanel.logout": "Wyloguj się",

        // =====================
        // AUTH – LOGIN
        // =====================
        "auth.login.title": "Logowanie",
        "auth.login.subtitle": "Zaloguj się, aby kontynuować.",
        "auth.login.forgotPassword": "Nie pamiętasz hasła?",
        "auth.login.submit": "Zaloguj się",
        "auth.login.noAccount": "Nie masz konta?",
        "auth.login.goToRegister": "Załóż konto",

        // =====================
        // AUTH – REGISTER
        // =====================
        "auth.register.title": "Rejestracja",
        "auth.register.subtitle": "Utwórz nowe konto.",
        "auth.register.submit": "Zarejestruj się",
        "auth.register.haveAccount": "Masz już konto?",
        "auth.register.goToLogin": "Zaloguj się",

        // =====================
        // AUTH – FORGOT-PASSWORD
        // =====================
        "auth.forgot.title": "Reset hasła",
        "auth.forgot.subtitle": "Podaj email, na który wyślemy link do resetu hasła.",
        "auth.forgot.submit": "Wyślij link resetujący",
        "auth.forgot.backInfo": "Pamiętasz hasło?",
        "auth.forgot.goToLogin": "Wróć do logowania",
        "auth.forgot.success": "Jeśli konto istnieje, wysłaliśmy link do resetu hasła na podany adres.",
        "auth.forgot.error": "Nie udało się wysłać linku resetującego.",
        "auth.forgot.loading": "Wysyłanie...",
        "auth.forgot.tryAgain": "Spróbuj ponownie za chwilę.",
        // =====================
        // AUTH – RESET PASSWORD (NEW)
        // =====================
        "auth.reset.title": "Ustaw nowe hasło",
        "auth.reset.subtitle": "Wprowadź nowe hasło dla swojego konta.",
        "auth.reset.submit": "Zapisz nowe hasło",
        "auth.reset.success": "Hasło zostało zresetowane. Możesz się teraz zalogować.",
        "auth.reset.error": "Nie udało się zresetować hasła.",
        "auth.reset.backToLogin": "Wróć do logowania",
        "auth.reset.missingToken": "Link resetu hasła jest nieprawidłowy lub wygasł.",


        // =====================
        // AUTH - FIELDS
        // =====================
        "auth.fields.name": "Nazwa",
        "auth.fields.email": "Email",
        "auth.fields.password": "Hasło",
        "auth.fields.confirmPassword": "Powtórz hasło",
        "auth.fields.showPassword": "Pokaż",
        "auth.fields.hidePassword": "Schowaj",

        // =====================
        // AUTH - PLACEHOLDERS
        // =====================
        "auth.placeholders.email": "twoj.email@example.com",
        "auth.placeholders.name": "Twoja nazwa",
        "auth.placeholders.password": "••••••••",

        // =====================
        // AUTH - COMMON
        // =====================
        "auth.common.loading": "Przetwarzanie...",

        // =====================
        // AUTH – ERRORS
        // =====================
        "auth.errors.email.required": "Email jest wymagany.",
        "auth.errors.email.invalid": "Podaj poprawny adres email.",
        "auth.errors.password.required": "Hasło jest wymagane.",
        "auth.errors.password.tooShort": "Hasło musi mieć co najmniej 8 znaków.",
        "auth.errors.confirmPassword.required": "Potwierdzenie hasła jest wymagane.",
        "auth.errors.confirmPassword.mismatch": "Hasła muszą być takie same.",

        // =========================================================
        // TRAININGS – GENERAL
        // =========================================================
        "training.title": "Treningi",
        "training.addNew": "Dodaj nowy trening",
        "training.details": "Szczegóły treningu",
        "training.selectHint": "Wybierz trening z listy",
        "training.noTrainings": "Brak treningów",

        // ✅ TRAININGS – DETAILS VIEW (NEW)
        "training.create.hint": "Po utworzeniu treningu przejdziesz automatycznie do szczegółów.",
        "training.details.entries": "wpisów",
        "training.details.addEntry": "Dodaj wpis",
        "training.details.saveDetails": "Zapisz szczegóły",
        "training.details.summary.title": "Podsumowanie (łącznie)",
        "training.details.summary.order": "najnowsze na górze",
        "training.details.summary.totalDuration": "Łączny czas",
        "training.details.summary.totalDistance": "Łączny dystans",
        "training.details.summary.totalCalories": "Łączne kalorie",
        "training.details.summary.avgSpeed": "Średnia prędkość",
        "training.details.summary.avgPace": "Średnie tempo",
        "training.details.history.title": "Historia zakończeń",
        "training.details.history.empty": "Brak wpisów. Kliknij „Dodaj wpis”.",
        "training.details.history.remove": "Usuń",
        "training.details.modal.title": "Dodaj wpis",
        "training.details.modal.subtitle": "To doda nowy wpis i zaktualizuje sumy.",
        "training.details.modal.duration": "Czas (min)",
        "training.details.modal.distance": "Dystans (m)",
        "training.details.modal.estimatedCalories": "Szacowane kalorie",
        "training.details.modal.usingWeight": "Używana waga: {weight} kg (ustaw w profilu).",
        "training.details.modal.cancel": "Anuluj",
        "training.details.modal.add": "Dodaj wpis",

        // ✅ TRAININGS – VALIDATIONS/CONFIRMS (NEW)
        "training.entry.validation.provideDurationOrDistance": "Podaj czas lub dystans.",
        "training.entry.confirm.remove": "Usunąć ten wpis?",

        // =====================
        // TRAININGS – STATUS
        // =====================
        "training.status.planned": "Zaplanowany",
        "training.status.in_progress": "W trakcie",
        "training.status.finished": "Zakończony",
        "training.status.unknown": "Nieznany",

        // =====================
        // TRAININGS – TYPES
        // =====================
        "training.type.running": "Bieganie",
        "training.type.swimming": "Pływanie",
        "training.type.gym": "Siłownia",
        "training.type.cycling": "Rower",
        "training.type.walking": "Spacer",
        "training.type.yoga": "Joga",
        "training.type.boxing": "Boks",
        "training.type.other": "Inny",
        "training.type.skating": "Rolki",
        "training.type.skateboarding": "Deskorolka",


        // =====================
        // TRAININGS – FIELDS
        // =====================
        "training.fields.name": "Nazwa treningu",
        "training.fields.type": "Typ treningu",
        "training.fields.duration": "Czas",
        "training.fields.distance": "Dystans",
        "training.fields.calories": "Kalorie",
        "training.fields.distanceM": "Dystans (m)",
        "training.fields.durationMin": "Czas (min)",
        "training.fields.note": "Notatka",
        "training.list.title": "Lista treningów",
        "training.list.empty": "Brak treningów. Kliknij „{cta}”.",
        "training.fields.photo": "Zdjęcie",


        // =====================
        // TRAININGS – UNITS
        // =====================
        "training.units.minutes": "min",
        "training.units.meters": "m",
        "training.units.kilometers": "km",
        "training.units.calories": "kcal",

        // =====================
        // TRAININGS – ACTIONS
        // =====================
        "training.actions.save": "Zapisz trening",
        "training.actions.update": "Aktualizuj trening",
        "training.actions.finish": "Zakończ trening",
        "training.actions.delete": "Usuń trening",
        "training.actions.back": "Wróć",

        // =====================
        // TRAININGS – CONFIRMATIONS
        // =====================
        "training.confirm.delete": "Czy na pewno chcesz usunąć ten trening?",
        "training.confirm.finish": "Czy na pewno chcesz zakończyć ten trening?",

        // =====================
        // TRAININGS – STATS
        // =====================
        "training.stats.title": "Statystyki treningów",
        "training.stats.totalTrainings": "Łączna liczba treningów",
        "training.stats.totalDuration": "Łączny czas",
        "training.stats.totalDistance": "Łączny dystans",
        "training.stats.totalCalories": "Łączne kalorie",

        "training.stats.titlePage": "Statystyki treningów",
        "training.stats.subtitle": "Dane z API /activities/stats",
        "training.stats.open": "Statystyki",
        "training.stats.openHint": "Podsumowanie globalne i miesięczne",
        "training.stats.backToTrainings": "Treningi",
        "training.stats.empty": "Brak danych statystycznych.",
        "training.stats.byType": "Podział według typu",
        "training.stats.monthly": "Miesięcznie",
        "training.stats.monthlyEmpty": "Brak danych miesięcznych.",
        "training.stats.monthlyTypesHint": "Szczegółowy podział typów można dodać później.",
        "training.stats.kpi.activities": "Liczba aktywności",
        "training.stats.kpi.distance": "Dystans łącznie",
        "training.stats.kpi.time": "Czas łącznie",
        "training.stats.kpi.avg": "Średnia (globalnie)",
        "training.stats.noteBackend": "Wyliczone po stronie backendu",

        "training.stats.apiHint": "Dane z API:",
        "training.stats.timeFieldHint": "czas: minuty w polu",
        "training.stats.distanceHint": "dystans: km",
        "training.stats.actions.back": "Wróć",
        "training.stats.kpi.totalActivities": "Łączna liczba treningów",
        "training.stats.kpi.totalTime": "Łączny czas",
        "training.stats.kpi.totalDistance": "Łączny dystans",
        "training.stats.sections.typesOverall": "Podsumowanie (łącznie) — typy",
        "training.stats.sections.monthly": "Miesiące",
        "training.stats.cards.distance": "Łączny dystans",
        "training.stats.cards.time": "Łączny czas",
        "training.stats.cards.avgSpeed": "Średnia prędkość",
        "training.stats.cards.pace": "Tempo",
        "training.stats.entriesCount": "{count} wpisów",
        "training.stats.monthlyTypesCount": "Typy w miesiącu: {count}",

        // =====================
        // COMMON
        // =====================
        "common.loading": "Ładowanie...",
        "common.create": "Utwórz",
        "common.error": "Wystąpił błąd",
        "common.refresh": "Odśwież",
        "common.save": "Zapisz",
        "common.cancel": "Anuluj",
        "common.delete": "Usuń",

        // =====================
        // ADMIN
        // =====================
        "admin.users.title": "Użytkownicy",
        "admin.users.id": "ID",
        "admin.users.verified": "Zweryfikowany",
        "admin.users.actions": "Akcje",
        "admin.users.edit": "Edytuj",
        "admin.users.delete": "Usuń",
        "admin.users.create": "Dodaj użytkownika",
        "admin.users.cancel": "Anuluj",
        "admin.users.save": "Zapisz",
        "admin.users.password": "Hasło",
        "admin.users.confirmDelete": "Usunąć użytkownika?",

        // =====================
        // DASHBOARD (NEW)
        // =====================
        "dashboard.title": "Dashboard",
        "dashboard.welcomeTitle": "Witaj",
        "dashboard.subtitle.loggedIn": "Zarządzaj treningami i ustawieniami w jednym miejscu.",
        "dashboard.subtitle.guest": "Zaloguj się, aby zacząć.",

        "dashboard.kpi.hint": "Lista treningów po lewej",
        "dashboard.kpi.durationHint": "Suma czasu ze wszystkich wpisów (entries) lokalnych.",
        "dashboard.kpi.caloriesHint": "Suma kalorii ze wszystkich wpisów (entries) lokalnych.",
        "dashboard.kpi.distanceHint": "Suma dystansu ze wszystkich wpisów (entries) lokalnych.",

        "dashboard.section.recent": "Ostatnie treningi",
        "dashboard.section.open": "Otwórz →",

        "dashboard.recent.loginHint": "Zaloguj się, aby zobaczyć swoje treningi.",
        "dashboard.recent.empty": "Brak treningów. Kliknij „{cta}”.",

        "dashboard.section.quick": "Szybkie akcje",
        "dashboard.quick.profile.title": "Profil",
        "dashboard.quick.profile.subtitle": "Ustaw nazwę i dane fitness (lokalnie)",
        "dashboard.quick.theme.title": "Motyw",
        "dashboard.quick.theme.current": "Aktualnie: {value}",
        "dashboard.quick.locale.title": "Język",
        "dashboard.quick.locale.current": "Aktualnie: {value}",

        "dashboard.status.title": "Status",
        "dashboard.status.loggedIn": "Zalogowany",
        "dashboard.status.user": "Użytkownik",
        "dashboard.status.role": "Rola",
        "dashboard.status.admin": "🛡️ Admin",
        "dashboard.status.adminPanel": "Panel administratora →",

        "dashboard.stats.globalNote": "Liczone globalnie: dystans / czas z wszystkich wpisów (entries).",
        "dashboard.stats.avgSpeedLabel": "Średnia prędkość",
    },

    en: {
        // =====================
        // COMMON – ACTIONS / STATES / CONFIRMS (NEW)
        // =====================
        "common.actions.refresh": "Refresh",
        "common.actions.resetFilters": "Reset filters",
        "common.actions.delete": "Delete",
        "common.actions.close": "Close",
        "common.actions.back": "Back",

        "common.states.loading": "Loading...",
        "common.states.noResults": "No results.",
        "common.states.noData": "No data.",

        "common.confirm.deleteActivity": "Delete activity?",
        "common.confirm.deleteUser": "Delete user?",

        // =====================
        // ADMIN – ACTIVITIES (NEW)
        // =====================
        "admin.activities.title": "Activities",
        "admin.activities.subtitle": "Filters apply to the whole loaded list.",
        "admin.activities.loaded": "Loaded: {loaded}",
        "admin.activities.filtered": "Results after filters: {filtered}",

        "admin.activities.filters.searchPlaceholder": "Search (name, email, note...)",
        "admin.activities.filters.userAll": "User: all",
        "admin.activities.filters.typeAll": "Type: all",
        "admin.activities.filters.dateFrom": "Date from",
        "admin.activities.filters.dateTo": "Date to",
        "admin.activities.filters.distanceMin": "Min distance",
        "admin.activities.filters.distanceMax": "Max distance",
        "admin.activities.filters.timeMin": "Min time",
        "admin.activities.filters.timeMax": "Max time",

        "admin.activities.table.id": "ID",
        "admin.activities.table.user": "User",
        "admin.activities.table.name": "Name",
        "admin.activities.table.type": "Type",
        "admin.activities.table.distance": "Distance",
        "admin.activities.table.time": "Time",
        "admin.activities.table.date": "Date",
        "admin.activities.table.actions": "Actions",

        "admin.activities.errors.fetch": "Could not load activities.",
        "admin.activities.errors.delete": "Could not delete.",

        // =====================
        // ADMIN – STATS (NEW)
        // =====================
        "admin.stats.title": "Global statistics",
        "admin.stats.subtitle": "Application-wide summary.",
        "admin.stats.cards.users": "Users",
        "admin.stats.cards.activities": "Activities",
        "admin.stats.cards.totalDistance": "Total distance",
        "admin.stats.cards.totalTime": "Total time",
        "admin.stats.rawValue": "raw: {value}",
        "admin.stats.errors.fetch": "Could not load stats.",

        // =====================
        // ADMIN – USERS (EXTENSION / CLEANUP)
        // =====================
        "admin.users.total": "{count} users",
        "admin.users.empty": "No data",

        // Field labels (NEW)
        "admin.fields.first_name": "First name",
        "admin.fields.last_name": "Last name",
        "admin.fields.birth_date": "Birth date",
        "admin.fields.gender": "Gender",
        "admin.fields.height": "Height",
        "admin.fields.weight": "Weight",
        "admin.fields.avatar": "Avatar",
        "admin.fields.created_at": "Created at",
        "admin.fields.updated_at": "Updated at",

        // Notes (NEW)
        "admin.users.emailNoChangeHint":
            "If the email stays the same, we do not send it to the API (to avoid unique constraint errors).",
        // =====================
        // ADMIN – NAV (NEW)
        // =====================
        "admin.panel.title": "Admin panel",
        "admin.panel.open": "Admin panel",
        "admin.panel.noAccess": "No access to the admin panel.",

        "admin.nav.dashboard": "Statistics",
        "admin.nav.dashboardDesc": "Global system statistics",

        "admin.nav.users": "Users",
        "admin.nav.usersDesc": "List, edit, delete",

        "admin.nav.activities": "Activities",
        "admin.nav.activitiesDesc": "Filters, search, delete",

        // =====================
        // SETTINGS - THEME
        // =====================
        "settings.theme.title": "Theme",
        "settings.theme.light": "Light",
        "settings.theme.dark": "Dark",

        // =====================
        // SETTINGS - LOCALE
        // =====================
        "settings.locale.title": "Language",
        "settings.locale.pl": "PL",
        "settings.locale.en": "EN",

        // =====================
        // SETTINGS - PROFILE
        // =====================
        "settings.profile.title": "Profile",
        "settings.profile.open": "Open profile",
        "settings.profile.save": "Save profile",
        // ✅ PROFILE – SEPARATE SAVE (NEW)
        "settings.profile.saveName": "Save name",
        "settings.profile.saveEmail": "Save email",
        "settings.profile.noChanges": "No changes to save.",
        "settings.profile.emailRequired": "Email is required.",

        // ✅ PROFILE – EXTRA (NEW)
        "settings.profile.refreshSuccess": "Profile refreshed.",
        "settings.profile.saveSuccess": "Profile saved.",
        "settings.profile.nameRequired": "Name is required.",
        "settings.profile.refreshError": "Could not refresh profile.",
        "settings.profile.saveError": "Could not save profile.",

        // ✅ PASSWORD (NEW)
        "settings.password.title": "Change password",
        "settings.password.current": "Current password",
        "settings.password.new": "New password",
        "settings.password.confirm": "Confirm new password",
        "settings.password.submit": "Update password",
        "settings.password.success": "Password updated.",
        "settings.password.error": "Could not update password.",

        // ✅ FITNESS PROFILE (NEW)
        "settings.fitness.title": "Fitness profile (local)",
        "settings.fitness.reset": "Reset",
        "settings.fitness.info":
            "These values are stored locally and used for calorie estimation in trainings.",
        "settings.fitness.weight": "Weight (kg)",
        "settings.fitness.height": "Height (cm)",
        "settings.fitness.age": "Age",
        "settings.fitness.save": "Save fitness profile",
        "settings.fitness.currentValues": "Current values:",

        // =====================
        // USER PANEL
        // =====================
        "userPanel.greeting.noName": "Welcome!",
        "userPanel.greeting.withName": "Welcome {name}!",
        "userPanel.actionsHint": "(Logout / profile)",
        "userPanel.login": "Log in",
        "userPanel.logout": "Log out",

        // =====================
        // AUTH – LOGIN
        // =====================
        "auth.login.title": "Login",
        "auth.login.subtitle": "Sign in to continue.",
        "auth.login.forgotPassword": "Forgot your password?",
        "auth.login.submit": "Sign in",
        "auth.login.noAccount": "Don't have an account?",
        "auth.login.goToRegister": "Create one",

        // =====================
        // AUTH – REGISTER
        // =====================
        "auth.register.title": "Register",
        "auth.register.subtitle": "Create a new account.",
        "auth.register.submit": "Sign up",
        "auth.register.haveAccount": "Already have an account?",
        "auth.register.goToLogin": "Sign in",

        // =====================
        // AUTH – FORGOT-PASSWORD
        // =====================
        "auth.forgot.title": "Reset password",
        "auth.forgot.subtitle": "Enter your email and we will send you a reset link.",
        "auth.forgot.submit": "Send reset link",
        "auth.forgot.backInfo": "Remember your password?",
        "auth.forgot.goToLogin": "Back to login",
        "auth.forgot.success": "If the account exists, we sent a password reset link to the provided email.",
        "auth.forgot.error": "Could not send the reset link.",
        "auth.forgot.loading": "Sending...",
        "auth.forgot.tryAgain": "Please try again in a moment.",
        // =====================
        // AUTH – RESET PASSWORD (NEW)
        // =====================
        "auth.reset.title": "Set new password",
        "auth.reset.subtitle": "Enter a new password for your account.",
        "auth.reset.submit": "Save new password",
        "auth.reset.success": "Password has been reset. You can now log in.",
        "auth.reset.error": "Could not reset password.",
        "auth.reset.backToLogin": "Back to login",
        "auth.reset.missingToken": "Password reset link is invalid or has expired.",



        // =====================
        // AUTH - FIELDS
        // =====================
        "auth.fields.name": "Name",
        "auth.fields.email": "Email",
        "auth.fields.password": "Password",
        "auth.fields.confirmPassword": "Confirm password",
        "auth.fields.showPassword": "Show",
        "auth.fields.hidePassword": "Hide",

        // =====================
        // AUTH - PLACEHOLDERS
        // =====================
        "auth.placeholders.email": "your.email@example.com",
        "auth.placeholders.name": "Your name",
        "auth.placeholders.password": "••••••••",

        // =====================
        // AUTH - COMMON
        // =====================
        "auth.common.loading": "Processing...",

        // =====================
        // AUTH – ERRORS
        // =====================
        "auth.errors.email.required": "Email is required.",
        "auth.errors.email.invalid": "Enter a valid email address.",
        "auth.errors.password.required": "Password is required.",
        "auth.errors.password.tooShort": "Password must be at least 8 characters.",
        "auth.errors.confirmPassword.required": "Password confirmation is required.",
        "auth.errors.confirmPassword.mismatch": "Passwords must match.",

        // =========================================================
        // TRAININGS – GENERAL
        // =========================================================
        "training.title": "Trainings",
        "training.addNew": "Add new training",
        "training.details": "Training details",
        "training.selectHint": "Select a training from the list",
        "training.noTrainings": "No trainings",

        // ✅ TRAININGS – DETAILS VIEW (NEW)
        "training.create.hint": "After creating a training you will be redirected to details automatically.",
        "training.details.entries": "entries",
        "training.details.addEntry": "Add entry",
        "training.details.saveDetails": "Save details",
        "training.details.summary.title": "Summary (Totals)",
        "training.details.summary.order": "newest first",
        "training.details.summary.totalDuration": "Total duration",
        "training.details.summary.totalDistance": "Total distance",
        "training.details.summary.totalCalories": "Total calories",
        "training.details.summary.avgSpeed": "Avg speed",
        "training.details.summary.avgPace": "Avg pace",
        "training.details.history.title": "Finish history",
        "training.details.history.empty": "No entries yet. Click “Add entry”.",
        "training.details.history.remove": "Remove",
        "training.details.modal.title": "Add entry",
        "training.details.modal.subtitle": "This will add a new entry and update totals.",
        "training.details.modal.duration": "Duration (min)",
        "training.details.modal.distance": "Distance (m)",
        "training.details.modal.estimatedCalories": "Estimated calories",
        "training.details.modal.usingWeight": "Using weight: {weight} kg (set in Profile).",
        "training.details.modal.cancel": "Cancel",
        "training.details.modal.add": "Add entry",

        // ✅ TRAININGS – VALIDATIONS/CONFIRMS (NEW)
        "training.entry.validation.provideDurationOrDistance": "Provide duration or distance.",
        "training.entry.confirm.remove": "Remove this entry?",

        // =====================
        // TRAININGS – STATUS
        // =====================
        "training.status.planned": "Planned",
        "training.status.in_progress": "In progress",
        "training.status.finished": "Finished",
        "training.status.unknown": "Unknown",

        // =====================
        // TRAININGS – TYPES
        // =====================
        "training.type.running": "Running",
        "training.type.swimming": "Swimming",
        "training.type.gym": "Gym",
        "training.type.cycling": "Cycling",
        "training.type.walking": "Walking",
        "training.type.yoga": "Yoga",
        "training.type.boxing": "Boxing",
        "training.type.other": "Other",
        "training.type.skating": "Skating",
        "training.type.skateboarding": "Skateboarding",


        // =====================
        // TRAININGS – FIELDS
        // =====================
        "training.fields.name": "Training name",
        "training.fields.type": "Training type",
        "training.fields.duration": "Duration",
        "training.fields.distance": "Distance",
        "training.fields.calories": "Calories",
        "training.fields.distanceM": "Distance (m)",
        "training.fields.durationMin": "Time (min)",
        "training.fields.note": "Note",
        "training.list.title": "Training list",
        "training.list.empty": "No trainings yet. Click “{cta}”.",
        "training.fields.photo": "Photo",



        // =====================
        // TRAININGS – UNITS
        // =====================
        "training.units.minutes": "min",
        "training.units.meters": "m",
        "training.units.kilometers": "km",
        "training.units.calories": "kcal",

        // =====================
        // TRAININGS – ACTIONS
        // =====================
        "training.actions.save": "Save training",
        "training.actions.update": "Update training",
        "training.actions.finish": "Finish training",
        "training.actions.delete": "Delete training",
        "training.actions.back": "Back",

        // =====================
        // TRAININGS – CONFIRMATIONS
        // =====================
        "training.confirm.delete": "Are you sure you want to delete this training?",
        "training.confirm.finish": "Are you sure you want to finish this training?",

        // =====================
        // TRAININGS – STATS
        // =====================
        "training.stats.title": "Training statistics",
        "training.stats.totalTrainings": "Total trainings",
        "training.stats.totalDuration": "Total duration",
        "training.stats.totalDistance": "Total distance",
        "training.stats.totalCalories": "Total calories",

        "training.stats.titlePage": "Training statistics",
        "training.stats.subtitle": "Data from API /activities/stats",
        "training.stats.open": "Statistics",
        "training.stats.openHint": "Global and monthly summary",
        "training.stats.backToTrainings": "Trainings",
        "training.stats.empty": "No statistics data.",
        "training.stats.byType": "Breakdown by type",
        "training.stats.monthly": "Monthly",
        "training.stats.monthlyEmpty": "No monthly data.",
        "training.stats.monthlyTypesHint": "Detailed type breakdown can be added later.",
        "training.stats.kpi.activities": "Activities count",
        "training.stats.kpi.distance": "Total distance",
        "training.stats.kpi.time": "Total time",
        "training.stats.kpi.avg": "Average (global)",
        "training.stats.noteBackend": "Calculated on backend",

        "training.stats.apiHint": "API data:",
        "training.stats.timeFieldHint": "time: minutes in field",
        "training.stats.distanceHint": "distance: km",
        "training.stats.actions.back": "Back",
        "training.stats.kpi.totalActivities": "Total trainings",
        "training.stats.kpi.totalTime": "Total time",
        "training.stats.kpi.totalDistance": "Total distance",
        "training.stats.sections.typesOverall": "Overall summary — types",
        "training.stats.sections.monthly": "Months",
        "training.stats.cards.distance": "Total distance",
        "training.stats.cards.time": "Total time",
        "training.stats.cards.avgSpeed": "Average speed",
        "training.stats.cards.pace": "Pace",
        "training.stats.entriesCount": "{count} entries",
        "training.stats.monthlyTypesCount": "Types in month: {count}",

        // =====================
        // COMMON
        // =====================
        "common.loading": "Loading...",
        "common.create": "Create",
        "common.error": "An error occurred",
        "common.refresh": "Refresh",
        "common.save": "Save",
        "common.cancel": "Cancel",
        "common.delete": "Delete",

        // =====================
        // ADMIN
        // =====================
        "admin.users.title": "Users",
        "admin.users.id": "ID",
        "admin.users.verified": "Verified",
        "admin.users.actions": "Actions",
        "admin.users.edit": "Edit",
        "admin.users.delete": "Delete",
        "admin.users.create": "Create user",
        "admin.users.cancel": "Cancel",
        "admin.users.save": "Save",
        "admin.users.password": "Password",
        "admin.users.confirmDelete": "Delete user?",

        // =====================
        // DASHBOARD (NEW)
        // =====================
        "dashboard.title": "Dashboard",
        "dashboard.welcomeTitle": "Welcome",
        "dashboard.subtitle.loggedIn": "Manage trainings and settings in one place.",
        "dashboard.subtitle.guest": "Log in to get started.",

        "dashboard.kpi.hint": "Training list on the left",
        "dashboard.kpi.durationHint": "Sum of duration from all local entries.",
        "dashboard.kpi.caloriesHint": "Sum of calories from all local entries.",
        "dashboard.kpi.distanceHint": "Sum of distance from all local entries.",

        "dashboard.section.recent": "Recent trainings",
        "dashboard.section.open": "Open →",

        "dashboard.recent.loginHint": "Log in to see your trainings.",
        "dashboard.recent.empty": "No trainings yet. Click “{cta}”.",

        "dashboard.section.quick": "Quick actions",
        "dashboard.quick.profile.title": "Profile",
        "dashboard.quick.profile.subtitle": "Set name and fitness data (local)",
        "dashboard.quick.theme.title": "Theme",
        "dashboard.quick.theme.current": "Current: {value}",
        "dashboard.quick.locale.title": "Language",
        "dashboard.quick.locale.current": "Current: {value}",

        "dashboard.status.title": "Status",
        "dashboard.status.loggedIn": "Logged in",
        "dashboard.status.user": "User",
        "dashboard.status.role": "Role",
        "dashboard.status.admin": "🛡️ Admin",
        "dashboard.status.adminPanel": "Admin panel →",

        "dashboard.stats.globalNote": "Global calc: distance / time from all entries.",
        "dashboard.stats.avgSpeedLabel": "Average speed",
    },
} as const;

export type Locale = keyof typeof messages;
export type MessageKey = keyof (typeof messages)["pl"];
