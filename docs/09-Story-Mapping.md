# Keria — Story Mapping

---

## Personas

### Persona 1 : L'organisateur social
**Nom :** Marie, 28 ans
**Profil :** UI Designer en agence, Paris 11e
**Contexte :** Organise regulierement des diners et sorties entre amis disperses en Ile-de-France (Paris, Montreuil, Vincennes, Creteil). Frustree de toujours se retrouver au meme endroit par defaut.
**Besoin :** Trouver un lieu equitable pour que personne ne fasse plus de trajet que les autres.
**Scenario type :** Cree un MeetPoint, partage le code a ses 4 amis, attend qu'ils rejoignent, lance la recherche de lieux, vote et confirme le restaurant.

### Persona 2 : Le participant occasionnel
**Nom :** Pierre, 32 ans
**Profil :** Developpeur backend, Vincennes
**Contexte :** Recoit un code de MeetPoint par SMS ou WhatsApp. Ne veut pas telecharger d'application ni creer de compte.
**Besoin :** Rejoindre rapidement, partager sa position, voir ou se retrouver.
**Scenario type :** Ouvre le lien, saisit le code, autorise la geolocalisation, choisit "metro", voit le lieu confirme sur la carte.

### Persona 3 : L'organisatrice d'evenement
**Nom :** Sarah, 35 ans
**Profil :** Event planner freelance
**Contexte :** Organise des journees team building multi-etapes (brunch, activite, restaurant, bar). A besoin de planifier un itineraire complet avec horaires.
**Besoin :** Creer un evenement avec plusieurs etapes ordonnees, inviter des participants, gerer les reponses.
**Scenario type :** Cree un evenement 4 etapes, partage le code, voit les reponses RSVP en temps reel, ajuste les horaires.

---

## Scenarios utilisateur

### S1 : Organiser un diner entre amis disperses
Marie cree un MeetPoint "Diner anniversaire Lucas", partage le code ABC123 dans le groupe WhatsApp. Pierre, Lea et Thomas rejoignent avec leur position. L'application calcule un point central pres de Nation (fairnessScore 87/100). Marie lance la recherche de restaurants, tout le monde vote, et "Le Bouillon Chartier" remporte avec 3 upvotes.

### S2 : Rejoindre un MeetPoint existant
Pierre recoit le code ABC123 par SMS. Il ouvre l'application via /join, saisit le code, autorise sa geolocalisation, selectionne "Metro", et rejoint. Il voit la carte avec les positions de tous les participants et le point central calcule.

### S3 : Organiser une journee team building
Sarah cree un evenement "Team Building Tech Corp" avec 4 etapes : Brunch (10h, Bastille), Escape Game (14h, Republique), Diner (19h, Oberkampf), Bar (22h, Menilmontant). Elle partage le code E8K4P2. Les 12 participants rejoignent et repondent via le systeme RSVP.

### S4 : Voter pour un lieu de rendez-vous
Apres le calcul du midpoint, Marie clique "Rechercher des lieux". L'application affiche 8 restaurants a proximite avec photos, notes et prix. Pierre upvote "Le Bouillon Chartier" et downvote "McDonald's". Le classement se met a jour en temps reel. Marie selectionne le lieu gagnant.

---

## Epics

| Epic | Description | Stories | Priorite |
|------|-------------|---------|----------|
| EP01 — Gestion des MeetPoints | Creation, partage de code, gestion des statuts | [#1](https://github.com/NoeLedoux1234/Keria/issues/1), [#2](https://github.com/NoeLedoux1234/Keria/issues/2), [#3](https://github.com/NoeLedoux1234/Keria/issues/3) | MVP |
| EP02 — Gestion des participants | Inscription, geolocalisation, transport | [#4](https://github.com/NoeLedoux1234/Keria/issues/4), [#5](https://github.com/NoeLedoux1234/Keria/issues/5), [#6](https://github.com/NoeLedoux1234/Keria/issues/6) | MVP |
| EP03 — Calcul du point de rencontre | Midpoint equitable, score d'equite, routes | [#7](https://github.com/NoeLedoux1234/Keria/issues/7), [#8](https://github.com/NoeLedoux1234/Keria/issues/8) | MVP |
| EP04 — Lieux et votes | Recherche de lieux, systeme de vote, selection | [#9](https://github.com/NoeLedoux1234/Keria/issues/9), [#10](https://github.com/NoeLedoux1234/Keria/issues/10), [#11](https://github.com/NoeLedoux1234/Keria/issues/11) | MVP |
| EP05 — Evenements multi-etapes | Creation, etapes, RSVP | [#12](https://github.com/NoeLedoux1234/Keria/issues/12), [#13](https://github.com/NoeLedoux1234/Keria/issues/13), [#14](https://github.com/NoeLedoux1234/Keria/issues/14) | MVP |
| EP06 — Interface et design | Landing page, navigation, design system | [#15](https://github.com/NoeLedoux1234/Keria/issues/15), [#16](https://github.com/NoeLedoux1234/Keria/issues/16) | MVP |

---

## Carte des Stories par Sprint

| Sprint | Stories | Thème |
|--------|---------|-------|
| Sprint 1 (fév S1) | #1 Créer MeetPoint, #2 Rejoindre code, #3 Partager code, #16 Design system | Fondations |
| Sprint 2 (fév S2) | #4 Géoloc, #5 Adresse manuelle, #6 Transport, #15 Landing page | Participants |
| Sprint 3 (mars S1) | #7 Calcul midpoint, #8 Afficher routes | Carte et calcul |
| Sprint 4 (mars S2) | #9 Rechercher lieux, #10 Voter, #11 Sélectionner lieu | Lieux et votes |
| Sprint 5 (avr S1) | #12 Créer événement, #13 Rejoindre event, #14 RSVP | Événements |
| Sprint 6 (avr S2) | #17 Tests, #18 CI/CD, #19 Error boundaries, #20 Loading | Qualité |
| Sprint 7 (mai) | #21 A11y, #22 Responsive, #23 SEO, #24 Performance | Polish |
