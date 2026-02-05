# Keria — Étude de Marché

---

## Contexte Général

Le marché des applications de coordination sociale connaît une croissance soutenue, portée par l'évolution des modes de vie post-pandémie. La généralisation du télétravail a dispersé les équipes, la mobilité accrue des individus a éclaté les cercles sociaux traditionnels, et la digitalisation des interactions a créé une attente forte en matière d'outils de coordination.

En France, quinze millions de personnes organisent régulièrement des sorties de groupe. À l'échelle européenne, le marché des applications de coordination est estimé à deux milliards d'euros, avec une croissance annuelle de douze à quinze pour cent sur le segment.

Des applications de référence ont démontré la viabilité de ce marché :

| Application | Fonction | Utilisateurs |
|-------------|----------|--------------|
| Doodle | Planification de dates | 30 millions |
| Tricount | Partage de dépenses | 10 millions |
| Splitwise | Partage de dépenses | 20 millions |
| WhatsApp | Communication | 2 milliards |

Un constat s'impose néanmoins : aucune solution ne s'attaque spécifiquement à la question de l'équité géographique des points de rencontre. Ce segment reste vacant, offrant une opportunité de positionnement claire pour Keria.

---

## Analyse SWOT

### Forces

Keria répond à un besoin universel qui n'est actuellement pas adressé par le marché. Cette différenciation claire constitue un avantage fondamental pour la pénétration du marché.

L'algorithme propriétaire de calcul d'équité représente un avantage technique difficilement réplicable à court terme. Il ne s'agit pas simplement de calculer un barycentre géographique, mais d'optimiser l'équité des temps de trajet en tenant compte des modes de transport et des conditions réelles de circulation.

L'effet réseau naturel, généré par le mécanisme de partage de codes, permet une croissance organique à faible coût d'acquisition. Chaque session créée est une opportunité de recruter de nouveaux utilisateurs.

La stack technologique moderne et scalable garantit la capacité d'évolution du produit et sa maintenance à long terme. L'architecture choisie, combinant Next.js, React, Convex et Mapbox, représente l'état de l'art en matière de développement web.

Les coûts d'infrastructure sont maîtrisés grâce à l'architecture serverless, permettant une rentabilité rapide même avec des revenus modestes.

Enfin, l'absence d'inscription obligatoire pour participer à une session réduit les frictions d'adoption et favorise la viralité.

### Faiblesses

L'équipe réduite à un développeur solo limite la capacité de production et représente un risque de concentration des compétences. Le recrutement de profils complémentaires est une priorité identifiée.

L'absence d'application mobile native pénalise l'expérience utilisateur sur smartphone, usage pourtant majoritaire. Le développement mobile est planifié comme priorité.

La notoriété de marque est à construire intégralement. Sans historique ni référence, la stratégie de contenu et de communication devra être particulièrement travaillée.

La dépendance aux APIs tierces crée une vulnérabilité potentielle en cas de changement de conditions tarifaires. Des alternatives ont été identifiées pour chaque service critique : Leaflet ou Google Maps pour Mapbox, OpenStreetMap ou Yelp pour Google Places.

L'historique utilisateur est encore limité, ne permettant pas de démontrer statistiquement la rétention et la satisfaction à long terme.

### Opportunités

La généralisation du travail hybride crée une demande croissante d'outils de coordination pour les équipes distribuées. Le segment B2B est en pleine expansion.

Les entreprises recherchent activement des solutions pour maintenir le lien social entre collaborateurs distants. L'offre Business de Keria répond directement à ce besoin.

Les partenariats avec les établissements locaux constituent une source de revenus potentielle significative, tout en enrichissant l'expérience utilisateur avec des suggestions qualifiées.

L'expansion géographique européenne permettrait de multiplier le marché adressable sans modification majeure du produit.

L'intégration avec les calendriers et outils collaboratifs comme Google Calendar, Slack ou Teams renforcerait l'ancrage de Keria dans l'écosystème quotidien des utilisateurs.

### Menaces

L'entrée de géants technologiques comme Google ou Meta sur ce segment représente le risque principal. Ces acteurs disposent des ressources pour développer rapidement une fonctionnalité équivalente et la distribuer à leur base d'utilisateurs massive. La réponse consiste à exécuter rapidement pour constituer une base fidèle avant leur éventuelle entrée.

L'intégration de fonctionnalités de point de rencontre dans les réseaux sociaux existants constitue une menace connexe. La spécialisation et la valeur ajoutée de Keria devront justifier l'usage d'une application dédiée.

Les évolutions réglementaires concernant les données de localisation pourraient contraindre certaines fonctionnalités. Une conformité proactive au RGPD et aux futures réglementations est essentielle.

Une récession économique pourrait réduire la fréquence des sorties et donc l'usage de l'application. Le modèle gratuit préservé permettrait néanmoins de maintenir la base utilisateurs.

---

## Analyse PESTEL

### Facteurs Politiques

Le cadre réglementaire européen pour les applications mobiles est stable et prévisible. L'environnement politique ne présente pas de risque majeur identifié pour l'activité de Keria.

Les politiques locales de soutien au commerce de proximité et à la mobilité durable représentent une opportunité. Des partenariats avec les collectivités territoriales pourraient être envisagés pour promouvoir les déplacements optimisés et la consommation locale.

### Facteurs Économiques

L'inflation modère les dépenses de sorties des ménages, mais ne supprime pas le besoin fondamental de lien social. Le modèle freemium, avec une offre gratuite complète, est particulièrement adapté à un contexte de contrainte budgétaire.

Le marché de l'emploi dans la tech reste tendu, avec des salaires élevés et une forte concurrence pour les talents. Le recrutement devra s'appuyer sur des arguments autres que la seule rémunération : projet, autonomie, participation au capital.

Le contexte d'investissement startup est devenu plus sélectif, mais reste favorable aux modèles démontrant une trajectoire vers la profitabilité. La structure de coûts légère de Keria répond à cette exigence.

### Facteurs Sociologiques

La tendance au local, renforcée par les préoccupations environnementales, favorise les rencontres de proximité que Keria optimise.

Le retour au présentiel après la période de télétravail généralisé crée une demande de coordination physique accrue. Les équipes doivent organiser leurs moments de présence commune.

La sensibilité croissante à l'équité dans les relations sociales trouve un écho dans la proposition de valeur de Keria : un algorithme qui garantit que personne ne fait plus d'efforts que les autres.

La digitalisation des interactions facilite l'adoption d'outils numériques pour organiser la vie sociale. Les utilisateurs sont prêts à utiliser une application dédiée si elle apporte une valeur claire.

### Facteurs Technologiques

La maturité des APIs de cartographie permet de construire des expériences riches et performantes à coût maîtrisé. Mapbox et Google Maps offrent des services de qualité avec des modèles de tarification accessibles.

La précision et la disponibilité universelle du GPS sur smartphone rendent possible la géolocalisation fine nécessaire au calcul du point équitable.

Les Progressive Web Apps offrent une alternative viable aux applications natives, permettant une première mise sur le marché rapide avant le développement mobile natif.

L'infrastructure cloud serverless réduit drastiquement les coûts et la complexité opérationnelle, autorisant une équipe réduite à gérer un produit scalable.

Les technologies temps réel comme WebSocket permettent une expérience utilisateur fluide où les mises à jour s'affichent instantanément pour tous les participants.

### Facteurs Environnementaux

L'optimisation des trajets générée par Keria contribue à la réduction de l'empreinte carbone des déplacements. Cet argument RSE peut être valorisé auprès des entreprises clientes.

La promotion des modes de déplacement doux comme le vélo, la marche ou les transports en commun dans les suggestions de trajet renforce le positionnement responsable.

La suggestion d'établissements de proximité encourage la consommation locale, en phase avec les préoccupations environnementales contemporaines.

### Facteurs Légaux

Le RGPD impose une gestion rigoureuse des données de localisation. Keria doit garantir la minimisation des données collectées, leur sécurisation, et le respect des droits des utilisateurs.

Le consentement explicite est requis pour toute géolocalisation. L'interface doit clairement informer l'utilisateur et recueillir son accord.

Le droit à l'oubli impose de pouvoir supprimer les données d'un utilisateur sur simple demande. L'architecture technique doit permettre cette suppression effective.

Les évolutions de la directive ePrivacy sont à surveiller pour anticiper d'éventuelles contraintes supplémentaires.

---

## Analyse des Cinq Forces de Porter

### Menace des Nouveaux Entrants

La menace est évaluée comme moyenne. Les barrières techniques à l'entrée sont faibles car les technologies nécessaires sont accessibles et bien documentées. Un développeur compétent peut reproduire les fonctionnalités de base.

Les barrières financières sont également faibles grâce à l'infrastructure cloud qui ne nécessite pas d'investissement initial lourd.

Cependant, l'effet réseau constitue un avantage significatif pour le premier entrant. Une fois qu'un groupe d'amis utilise Keria, le coût de coordination pour changer d'outil devient dissuasif.

Le risque principal réside dans l'éventualité qu'un acteur majeur comme Google ou Meta intègre cette fonctionnalité à ses produits existants, bénéficiant immédiatement de sa base d'utilisateurs.

### Pouvoir de Négociation des Fournisseurs

Le pouvoir des fournisseurs est faible. Mapbox peut être remplacé par Leaflet ou Google Maps. Google Places peut être substitué par OpenStreetMap ou Yelp API. L'hébergement sur Vercel a des alternatives équivalentes chez Netlify ou AWS. Seule la dépendance à Convex est plus marquée, mais des alternatives comme Firebase ou Supabase existent.

La multiplicité des alternatives disponibles pour chaque composant technique garantit qu'aucun fournisseur ne dispose d'un pouvoir de négociation critique.

### Pouvoir de Négociation des Clients

Le pouvoir des clients est moyen, mais varie selon les segments. Les utilisateurs gratuits disposent d'un pouvoir fort car le coût de changement est nul. Ils peuvent abandonner l'application sans conséquence. La qualité de l'expérience et la valeur perçue sont donc essentielles pour les retenir.

Les abonnés Premium ont un pouvoir moyen. Leur historique de rencontres et leurs habitudes créent une forme d'attachement, mais pas de verrouillage fort.

Les clients Business ont un pouvoir plus faible. L'intégration avec leurs outils, la formation des équipes, et les engagements contractuels créent des coûts de changement significatifs.

### Menace des Produits de Substitution

La menace est évaluée comme moyenne. La combinaison manuelle WhatsApp plus Google Maps permet d'aboutir au même résultat, mais de manière fastidieuse et sans calcul d'équité. Doodle ne traite que la dimension temporelle, pas géographique. Le simple appel téléphonique ne permet pas de visualisation ni de calcul. L'habitude du lieu habituel génère une inertie, mais aussi une insatisfaction latente que Keria peut capter.

Les substituts existent mais restent inférieurs en termes d'expérience utilisateur et d'équité. La proposition de valeur de Keria est suffisamment différenciante.

### Intensité de la Rivalité Concurrentielle

L'intensité concurrentielle est faible. Quelques solutions de niche existent mais restent peu connues et limitées en fonctionnalités. Aucun leader établi ne domine le marché du point de rencontre équitable.

Cette fragmentation représente une opportunité. Le marché est mûr pour qu'un acteur s'impose comme référence et consolide le segment.

---

## Synthèse

Le marché présente des conditions favorables au lancement de Keria. Le besoin est avéré et universel, aucun leader n'est installé, la croissance du segment est soutenue, et les barrières à l'entrée peuvent être constituées via l'effet réseau.

Les risques principaux concernent l'entrée possible d'un acteur majeur ou l'intégration de fonctionnalités équivalentes dans les réseaux sociaux existants.

Les facteurs clés de succès sont la rapidité d'exécution pour constituer une base d'utilisateurs avant la concurrence, la qualité de l'expérience utilisateur pour favoriser la rétention, la viralité maximisée via le mécanisme de partage de codes, et la fidélisation par la valeur ajoutée des offres Premium et Business.
