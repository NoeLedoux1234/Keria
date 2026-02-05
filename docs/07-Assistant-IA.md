# Keria — Assistant IA de Préférences

---

## Le Constat

Le calcul du point de rencontre équitable résout un problème fondamental : l'équité géographique. Cependant, l'équité seule ne suffit pas toujours. Un point parfaitement équidistant situé au milieu d'une zone industrielle ou d'un village sans infrastructure ne répond pas aux attentes des utilisateurs.

Les groupes d'amis ne cherchent pas seulement un point mathématiquement optimal. Ils cherchent une expérience. Certains veulent une ville animée avec des bars et des restaurants. D'autres préfèrent un cadre naturel près d'un lac ou en montagne. D'autres encore recherchent une destination culturelle avec musées et patrimoine historique.

Cette dimension qualitative manque aujourd'hui à Keria. L'algorithme optimise la distance, mais ignore les préférences humaines. Le résultat est parfois décevant : un point techniquement parfait, mais pratiquement inadapté.

---

## La Solution Proposée

L'intégration d'un assistant basé sur l'intelligence artificielle permet aux utilisateurs d'exprimer leurs envies en langage naturel. Au lieu de simplement calculer un point géométrique, Keria devient capable de comprendre des requêtes comme :

« On cherche une ville sympa avec des bars et des bons restaurants pour un week-end entre amis. »

« Un endroit calme près d'un lac pour se retrouver en famille. »

« Une destination avec des activités culturelles, des musées et une bonne gastronomie. »

L'assistant analyse ces préférences et suggère des villes ou des régions situées entre les participants qui correspondent à leurs attentes. Le calcul d'équité reste présent, mais il est enrichi par une dimension qualitative.

---

## Fonctionnement Technique

L'utilisateur décrit ses envies dans un champ texte libre après avoir créé son MeetPoint et ajouté les participants. Un appel à l'API Claude Haiku, modèle de langage développé par Anthropic, analyse cette requête et la traduit en critères structurés.

L'assistant dispose de la position géographique de tous les participants. Il calcule une zone de recherche raisonnable et propose trois à cinq villes qui répondent aux critères exprimés tout en restant accessibles pour l'ensemble du groupe.

Chaque suggestion est accompagnée d'une explication : pourquoi cette ville correspond aux préférences, sa distance moyenne par rapport aux participants, ses atouts principaux. L'utilisateur peut alors sélectionner la destination qui lui convient le mieux.

Une fois la ville choisie, la recherche de lieux concrets — restaurants, bars, activités — s'effectue autour de ce nouveau point de référence plutôt qu'autour du simple centre géométrique.

---

## Valeur Ajoutée

Cette fonctionnalité transforme Keria d'un simple outil de calcul en un véritable assistant de planification. La différence est fondamentale.

Sans l'assistant IA, l'utilisateur obtient un point sur une carte. Avec l'assistant IA, il obtient une recommandation personnalisée qui tient compte de ce qu'il veut réellement faire avec ses amis.

Cette évolution répond à un insight utilisateur crucial : les gens n'organisent pas des rencontres pour se retrouver à un point équidistant. Ils les organisent pour partager un moment, une expérience, une ambiance. L'équité géographique est un moyen, pas une fin.

L'assistant IA permet également de débloquer des situations où le point équitable tombe dans une zone inadaptée. Au lieu de proposer un compromis frustrant, Keria peut suggérer de décaler légèrement le point de rencontre vers une ville plus attractive, même si cela implique quelques kilomètres supplémentaires pour certains participants.

---

## Positionnement Concurrentiel

Aucune application de coordination de groupe n'intègre aujourd'hui d'intelligence artificielle pour comprendre les préférences qualitatives des utilisateurs. Les outils existants restent cantonnés à des filtres prédéfinis : type de cuisine, budget, distance maximale.

L'approche conversationnelle de Keria constitue une rupture. Elle permet d'exprimer des nuances impossibles à capturer via des cases à cocher : l'ambiance recherchée, le contexte de la rencontre, les contraintes implicites.

Cette fonctionnalité renforce également le caractère premium de l'offre. L'assistant IA peut être réservé aux abonnés, créant une incitation supplémentaire à la conversion vers les offres payantes.

---

## Modèle Économique de la Fonctionnalité

Le coût d'utilisation de l'API Claude Haiku est extrêmement faible : environ un centime d'euro pour trois requêtes. Pour dix utilisateurs quotidiens effectuant chacun trois recherches, le coût mensuel est inférieur à un euro.

Cette structure de coûts permet d'envisager plusieurs stratégies. La fonctionnalité peut être incluse dans l'offre gratuite avec une limite de requêtes mensuelles, par exemple trois suggestions par mois. Les utilisateurs Premium bénéficieraient d'un accès illimité.

Alternativement, l'assistant IA peut constituer un argument de différenciation réservé exclusivement aux abonnés, renforçant la proposition de valeur de l'offre payante sans impact significatif sur les marges.

---

## Feuille de Route

La première phase consiste à implémenter le système de base : champ de saisie des préférences, appel à l'API Claude, affichage des suggestions de villes. Cette phase permet de valider l'intérêt des utilisateurs pour la fonctionnalité.

La deuxième phase enrichit l'expérience : mémorisation des préférences pour les suggestions futures, affinage progressif basé sur les choix passés, suggestions proactives basées sur le contexte de la rencontre.

La troisième phase explore des fonctionnalités avancées : génération automatique de programmes de sortie, recommandations de dates optimales en fonction de la météo et des événements locaux, intégration avec des services de réservation.

---

## Conclusion

L'assistant IA représente une évolution naturelle de Keria. Il ne remplace pas le calcul d'équité qui reste au cœur de la proposition de valeur. Il l'enrichit en ajoutant une dimension humaine et qualitative.

Cette fonctionnalité positionne Keria non plus comme un simple calculateur de point médian, mais comme un véritable compagnon de planification de sorties. Elle répond à la question complète que se posent les utilisateurs : non seulement « où nous retrouver équitablement », mais aussi « où nous retrouver pour passer un bon moment ensemble ».

Dans un marché où les applications de coordination restent fonctionnellement limitées, l'intelligence artificielle offre à Keria une opportunité de différenciation majeure et durable.
