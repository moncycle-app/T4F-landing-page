---
title: "Interruption temporaire du service moncycle.app le 21 octobre 2026"
description: "Le 21 octobre 2026, tableau.moncycle.app a été indisponible environ quatre heures par mesure préventive face à des vulnérabilités critiques de PHP. Aucune donnée compromise."
pubDate: 2026-10-21
translationKey: php-security-outage
draft: false
---

Le mercredi 21 octobre 2026, l’application **tableau.moncycle.app** a été rendue indisponible pendant une durée d’environ quatre heures. Cette interruption résulte d’une mesure préventive prise par notre équipe technique, à la suite de l’annonce de vulnérabilités critiques affectant le langage PHP, utilisé par notre infrastructure. Le service est désormais pleinement rétabli et aucune donnée n’a été compromise.

## Contexte

PHP est un langage de programmation exécuté côté serveur, sur lequel reposent environ 70 % des sites web dans le monde, dont moncycle.app. Il assure notamment le traitement des requêtes et la génération des pages consultées par les utilisateurs.

Le 20 octobre 2026, l’équipe de développement de PHP a annoncé la publication, le lendemain à 16 h (heure de Paris), de correctifs de sécurité destinés à corriger deux vulnérabilités critiques, référencées **CVE-2026-109618** et **CVE-2026-109619**. Ces vulnérabilités ont reçu un score de gravité de 9,2 sur 10.

Elles sont susceptibles de permettre l’exécution de code arbitraire à distance, c’est-à-dire la prise de contrôle d’un serveur par un tiers non autorisé. L’environnement de production de moncycle.app figurait parmi les systèmes exposés.

## Mesures prises

Des informations relatives à ces vulnérabilités avaient été divulguées publiquement avant la mise à disposition des correctifs, et plusieurs experts en cybersécurité anticipaient des campagnes d’exploitation à grande échelle dès leur publication.

Au regard de ce niveau de risque, nous avons procédé, à titre préventif, à la **déconnexion de tableau.moncycle.app du réseau Internet**, en amont de la période d’exposition maximale. Cette mesure visait à supprimer toute possibilité d’accès au serveur jusqu’à la disponibilité du correctif officiel.

Dès la publication de celui-ci, nous avons procédé à la mise à jour du serveur vers la dernière version de PHP, puis à une série de vérifications de bon fonctionnement, avant de rétablir l’accès au service.

## Sécurité des données

Nous mesurons pleinement le caractère sensible et personnel des informations que nos utilisatrices et utilisateurs nous confient. La protection de ces données a constitué le critère déterminant de notre décision.

La déconnexion anticipée du serveur a permis d’écarter tout risque d’intrusion. **Le serveur n’a fait l’objet d’aucune compromission** et, hormis l’indisponibilité temporaire du service, cet incident n’a eu **aucune conséquence** sur les comptes, les observations ou les données de suivi enregistrées.

## Actions requises

**Aucune action n’est requise de la part des utilisatrices et utilisateurs.** Le service peut être utilisé normalement. Les observations qui n’ont pu être saisies pendant la période d’interruption peuvent être enregistrées dès à présent.

## Nos excuses

Nous présentons nos sincères excuses pour la gêne occasionnée par cette interruption. Entre la continuité du service et la sécurité des données, nous avons fait le choix de privilégier la seconde, conformément aux engagements qui guident le développement de moncycle.app.

## Pour en savoir plus

Les articles suivants apportent des informations complémentaires sur ces vulnérabilités et sur le langage PHP :

- [Failles critiques dans PHP : patch d’urgence aujourd’hui à 16 h, la France en première ligne](https://korben.info/failles-critiques-dans-php-patch-durgence-aujourdhui-a-16-h-la-france-en-premiere-ligne.html), *Korben.info*
- [Qu’est-ce que PHP, ce langage informatique qui a fait vaciller une partie d’Internet ?](https://www.lefigaro.fr/secteur/high-tech/qu-est-ce-que-php-ce-langage-informatique-qui-a-fait-vaciller-une-partie-d-internet-20261021), *Le Figaro*

Pour toute question relative à cet incident, notre équipe reste à votre disposition.

*L’équipe moncycle.app*
