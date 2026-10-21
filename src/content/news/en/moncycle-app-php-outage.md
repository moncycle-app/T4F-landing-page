---
title: "Temporary interruption of the moncycle.app service on October 21, 2026"
description: "On October 21, 2026, tableau.moncycle.app was unavailable for about four hours as a precaution against critical PHP vulnerabilities. No data was compromised."
pubDate: 2026-10-21
translationKey: php-security-outage
draft: false
---

On Wednesday, October 21, 2026, the **tableau.moncycle.app** application was unavailable for about four hours. This interruption was a preventive measure taken by our technical team following the announcement of critical vulnerabilities affecting the PHP language, which our infrastructure uses. The service is now fully restored and no data was compromised.

## Background

PHP is a server-side programming language on which about 70% of websites worldwide rely, including moncycle.app. Among other things, it handles requests and generates the pages that users view.

On October 20, 2026, the PHP development team announced that security fixes would be released the next day at 4 pm (Paris time) to address two critical vulnerabilities, tracked as **CVE-2026-109618** and **CVE-2026-109619**. These vulnerabilities received a severity score of 9.2 out of 10.

They may allow arbitrary code to be executed remotely, meaning that an unauthorized third party could take control of a server. The moncycle.app production environment was among the exposed systems.

## Measures taken

Information about these vulnerabilities had been publicly disclosed before the fixes were available, and several cybersecurity experts expected large-scale exploitation campaigns as soon as they were released.

In view of this level of risk, we **disconnected tableau.moncycle.app from the Internet** as a precaution, ahead of the period of maximum exposure. The aim was to remove any possibility of accessing the server until the official fix was available.

As soon as it was published, we updated the server to the latest version of PHP, then ran a series of checks to confirm everything worked properly, before restoring access to the service.

## Data security

We fully appreciate how sensitive and personal the information our users entrust to us is. Protecting this data was the deciding factor in our decision.

Disconnecting the server in advance ruled out any risk of intrusion. **The server was not compromised** and, apart from the temporary unavailability of the service, this incident had **no consequences** for accounts, observations or recorded tracking data.

## Required actions

**No action is required from users.** The service can be used as normal. Observations that could not be entered during the interruption can be recorded now.

## Our apologies

We sincerely apologize for the inconvenience caused by this interruption. Between service continuity and data security, we chose to prioritize the latter, in line with the commitments that guide the development of moncycle.app.

## Learn more

The following articles (in French) provide additional information about these vulnerabilities and the PHP language:

- [Failles critiques dans PHP : patch d’urgence aujourd’hui à 16 h, la France en première ligne](https://korben.info/failles-critiques-dans-php-patch-durgence-aujourdhui-a-16-h-la-france-en-premiere-ligne.html), *Korben.info*
- [Qu’est-ce que PHP, ce langage informatique qui a fait vaciller une partie d’Internet ?](https://www.lefigaro.fr/secteur/high-tech/qu-est-ce-que-php-ce-langage-informatique-qui-a-fait-vaciller-une-partie-d-internet-20261021), *Le Figaro*

If you have any questions about this incident, our team remains at your disposal.

*The moncycle.app team*
