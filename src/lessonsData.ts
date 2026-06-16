import { Lesson } from './types';

export const baccLessons: Lesson[] = [
  {
    id: 'maths-suites-numeriques',
    title: 'Suites Numériques (Arithmétiques et Géométriques)',
    category: 'Maths',
    series: ['A1', 'A2', 'C', 'D'],
    content: `### SUITES NUMÉRIQUES — Résumé Complet du Programme BACC

Une suite numérique est une suite ordonnée de nombres réels. La maîtrise de ce chapitre est essentielle car elle constitue un exercice incontournable du BACC (Séries A, C, D).

---

### 1. LES SUITES ARITHMÉTIQUES
Une suite $(u_n)$ est arithmétique si l'on passe d'un terme au suivant en additionnant toujours le même nombre $r$, appelé **raison**.
- **Relation de récurrence** : $u_{n+1} = u_n + r$
- **Formule du terme général** : 
  - Si le premier terme est $u_0$ : $u_n = u_0 + n \cdot r$
  - Si le premier terme est $u_1$ : $u_n = u_1 + (n-1) \cdot r$
  - De façon générale : $u_n = u_p + (n-p) \cdot r$
- **Somme des termes consécutifs** :
  $S = (\\text{Nombre de termes}) \\times \\frac{\\text{Premier terme} + \\text{Dernier terme}}{2}$

---

### 2. LES SUITES GÉOMÉTRIQUES
Une suite $(v_n)$ est géométrique si l'on passe d'un terme au suivant en multipliant toujours par le même nombre $q$, appelé **raison**.
- **Relation de récurrence** : $v_{n+1} = v_n \\times q$
- **Formule du terme général** :
  - Si le premier terme est $v_0$ : $v_n = v_0 \\times q^n$
  - Si le premier terme est $v_1$ : $v_n = v_1 \\times q^{n-1}$
  - De façon générale : $v_n = v_p \\times q^{n-p}$
- **Somme des termes consécutifs** (si $q \\neq 1$) :
  $S = \\text{Premier terme} \\times \\frac{1 - q^{\\text{Nombre de termes}}}{1 - q}$

---

### 3. CONVERGENCE ET LIMITES
- **Suite monotone** :
  - Si $u_{n+1} - u_n > 0$, la suite est **croissante**.
  - Si $u_{n+1} - u_n < 0$, la suite est **décroissante**.
- **Limite d'une suite géométrique** $q^n$ :
  - Si $|q| < 1$ : $\\lim_{n \\to +\\infty} q^n = 0$ (La suite converge)
  - Si $q > 1$ : $\\lim_{n \\to +\\infty} q^n = +\\infty$ (La suite diverge)`,
    keyPoints: [
      'Montrer qu\'une suite est arithmétique : calculer la différence u_{n+1} - u_n et vérifier qu\'elle est constante.',
      'Montrer qu\'une suite est géométrique : exprimer v_{n+1} en fonction de v_n par multiplication.',
      'Le nombre de termes d\'une somme allant de p à n est égal à (n - p + 1).'
    ],
    keyFormulas: [
      'u_n = u_0 + nr',
      'v_n = v_0 \\cdot q^n',
      'S_n = \\text{Nb de termes} \\times \\frac{\\text{Premier} + \\text{Dernier}}{2}'
    ]
  },
  {
    id: 'maths-fonction-logarithme',
    title: 'Fonction Logarithme Népérien (ln)',
    category: 'Maths',
    series: ['A1', 'A2', 'C', 'D'],
    content: `### FONCTION LOGARITHME NÉPÉRIEN (ln)

La fonction logarithme népérien, notée $\\ln$, est définie sur l'intervalle $]0, +\\infty[$. Elle est la bijection réciproque de la fonction exponentielle.

---

### 1. PROPRIÉTÉS ANALYTIQUES
- **Domaine de définition** : $D = ]0, +\\infty[$
- **Valeurs remarquables** : $\\ln(1) = 0$ et $\\ln(e) = 1$
- **Dérivée** : Pour tout $x > 0$, $\\ln'(x) = \\frac{1}{x}$
- **Dérivée de la forme composée** : Si $u(x) > 0$, $(\\ln(u))' = \\frac{u'}{u}$

---

### 2. PROPRIÉTÉS ALGÉBRIQUES
Pour tous réels strictement positifs $a$ et $b$ :
- $\\ln(a \\cdot b) = \\ln(a) + \\ln(b)$
- $\\ln(\\frac{a}{b}) = \\ln(a) - \\ln(b)$
- $\\ln(\\frac{1}{a}) = -\\ln(a)$
- $\\ln(a^n) = n \\cdot \\ln(a)$ (pour tout entier relatif $n$)
- $\\ln(\\sqrt{a}) = \\frac{1}{2}\\ln(a)$

---

### 3. LIMITES AUX BORNES ET LIMITES AMÉLIORÉES (Croissances comparées)
- $\\lim_{x \\to 0^+} \\ln(x) = -\\infty$ (Axe des ordonnées asymptote verticale)
- $\\lim_{x \\to +\\infty} \\ln(x) = +\\infty$
- **Limites de croissances comparées** :
  - $\\lim_{x \\to +\\infty} \\frac{\\ln(x)}{x} = 0$
  - $\\lim_{x \\to 0^+} x \\cdot \\ln(x) = 0$
  - $\\lim_{x \\to 0} \\frac{\\ln(1+x)}{x} = 1$`,
    keyPoints: [
      'N\'appliquez jamais ln(x) sur des valeurs négatives ou nulles. Toujours définir en premier lieu le domaine d\'étude.',
      'Le signe de ln(x) dépend de x : négatif sur ]0, 1[ et positif sur ]1, +\infty[.'
    ],
    keyFormulas: [
      '\\ln(ab) = \\ln(a) + \\ln(b)',
      '(\\ln(u))\' = \\frac{u\'}{u}',
      '\\lim_{x \\to +\\infty} \\frac{\\ln(x)}{x} = 0'
    ]
  },
  {
    id: 'physique-oscillations-electriques',
    title: 'Oscillations Électriques Libres et Forcées',
    category: 'Physique-Chimie',
    series: ['C', 'D'],
    content: `### OSCILLATIONS ÉLECTRIQUES LIBRES ET FORCÉES

Ce chapitre traite des circuits contenant des bobines d'inductance $L$, des condensateurs de capacité $C$ et des résistances $R$, d'où l'appellation circuits $RLC$.

---

### 1. CIRCUIT RLC EN OSCILLATIONS LIBRES (Amorties)
Lorsqu'un condensateur initialement chargé est connecté à une bobine réelle (de résistance interne $r$), on observe un échange d'énergie alternatif.
- **Équation différentielle en tension $u_c$** :
  $L \\cdot \\frac{d^2q}{dt^2} + R_T \\cdot \\frac{dq}{dt} + \\frac{1}{C} \\cdot q = 0$
- **Régimes oscillatoires selon la résistance totale** $R_T$ :
  - **Régime pseudo-périodique** : Pour un amortissement faible, oscillations sinusoïdales à amplitude décroissante. La période est appelée pseudo-période $T \\approx T_0$.
  - **Régime apériodique** : Amortissement fort (grande résistance), le condensateur se décharge sans osciller.

---

### 2. OSCILLATEUR IDÉAL LC (Non amorti)
Si la résistance totale est nulle ($R_T = 0$), l'énergie totale se conserve.
- **Période propre** : $T_0 = 2\\pi\\sqrt{L \\cdot C}$
- **Fréquence propre** : $N_0 = \\frac{1}{T_0} = \\frac{1}{2\\pi\\sqrt{LC}}$

---

### 3. OSCILLATIONS FORCÉES ET PHÉNOMÈNE DE RÉSONANCE
En reliant le circuit $RLC$ à un générateur délivrant une tension alternative $u(t) = U_m \\sin(\\omega t)$, l'oscillateur subit la fréquence $N$ imposée par le générateur.
- **La Résonance d'Intensité** : Lorsque la fréquence du générateur $N$ s'approche de la fréquence propre de l'oscillateur $N_0$, l'intensité efficace $I_eff$ du courant atteint une valeur maximale.
- L'impédance totale $Z$ est alors minimale : $Z = R_T$.`,
    keyPoints: [
      'À la résonance d\'intensité, le circuit se comporte comme un conducteur ohmique pur.',
      'Savoir calculer la période propre T_0 avec les bonnes unités : L en Henry (H), C en Farad (F).'
    ],
    keyFormulas: [
      'T_0 = 2\\pi\\sqrt{LC}',
      'E_c = \\frac{1}{2} C \\cdot u_C^2',
      'E_m = \\frac{1}{2} L \\cdot i^2'
    ]
  },
  {
    id: 'philo-etat-justice',
    title: 'L\'État et la Justice',
    category: 'Philosophie',
    series: ['A1', 'A2', 'C', 'D'],
    content: `### L'ÉTAT ET LA JUSTICE — Programme de Philosophie BACC

Ce thème interroge les fondements du vivre-ensemble, de l'autorité politique et des principes garantissant le droit et l'égalité au sein de la société.

---

### 1. L’ÉTAT : DÉFINITION ET ORIGINES
L'État est l'ensemble des institutions politiques, juridiques et administratives qui exercent une autorité souveraine sur un peuple et un territoire donné.
- **L’État de nature vs L’État civil (Théories du Contrat Social)** :
  - **Thomas Hobbes** (*Le Léviathan*) : L'état de nature est un état de guerre permanente (« l'homme est un loup pour l'homme »). L'État est donc nécessaire pour maintenir la sécurité, quitte à être autoritaire.
  - **Jean-Jacques Rousseau** (*Du Contrat Social*) : L'homme naît bon mais la société le corrompt. Le contrat social doit instituer un État qui exprime la « volonté générale » et maintient la liberté civile.

---

### 2. LA JUSTICE : IDÉAL MORAL ET ORDRE JURIDIQUE
La justice s'exprime sous deux aspects : la justice morale (faire ce qui est juste) et la justice légale (respecter la loi écrite).
- **Le rôle de la loi** : La loi écrite vise à éliminer l'arbitraire et la vengeance privée en instaurant des peines équitables pour tous.
- **La répartition des biens (Aristote)** :
  - **La justice distributive** : Distribuer les honneurs et les biens selon le mérite de chacun (égalité proportionnelle).
  - **La justice corrective / commutative** : Rétablir l'équilibre objectif lors d'échanges ou de fautes (égalité stricte).

---

### 3. SYNTHÈSE DE DISSERTATION : PEUT-ON SE PASSER DE L'ÉTAT ?
- Si l'État assure notre sécurité et nos droits, il s'avère indispensable pour éviter le chaos.
- Cependant, si l'État opprime les libertés individuelles, il prend la forme d'un appareil injuste (critique marxiste : « l'État est l'instrument de la classe bourgeoise »).
- **Ouverture** : Un État juste est celui dont les lois sont guidées par la justice morale et le bien public.`,
    keyPoints: [
      'Différencier le Légal (conforme à la loi écrite) du Légitime (conforme à l\'éthique et à l\'idéal de justice).',
      'Citer Rousseau pour illustrer l\'importance de la liberté guidée par la loi.'
    ],
    keyFormulas: [
      'Thomas Hobbes dans Le Léviathan (1651)',
      'Jean-Jacques Rousseau, Du Contrat Social (1762)'
    ]
  },
  {
    id: 'svt-genetique-humaine',
    title: 'Génétique et Hérédité Humaine',
    category: 'SVT',
    series: ['D', 'C'],
    content: `### GÉNÉTIQUE ET HÉRÉDITÉ HUMAINE

La génétique humaine étudie les règles de transmission des gènes au fil des générations, avec une application particulière au dépistage des maladies génétiques hereditaires.

---

### 1. CONCEPTS FONDAMENTAUX
- **Gène** : Segment d'ADN déterminant un caractère précis.
- **Allèle** : Une version possible d'un gène (exemple : allèle Dominant $A$, Recessif $a$).
- **Génotype** : La composition génétique d'un individu (ex: $AA$, $Aa$ ou $aa$).
- **Phénotype** : Le caractère observable ou exprimé (ex: $[A]$).

---

### 2. ÉTUDE DE LA TRANSMISSION PORTÉE PAR DES AUTOSOMES
Les chromosomes non sexuels (paires 1 à 22 chez l'humain) portent des caractères dits autosomaux.
- **Maladie récessive** : Une personne doit posséder deux exemplaires défectueux ($aa$) pour être malade. Les hétérozygotes ($Aa$) sont porteurs sains.
- **Maladie dominante** : Un seul exemplaire défectueux suffit pour exprimer la maladie. Tous les individus portant l'allèle anormal tombent malades.

---

### 3. TRANSMISSION PORTÉE PAR LES GONOSOMES (Chromosomes Sexuels X, Y)
- **Hérédité liée à l'Y** : Ne touche et ne se transmet que de père en fils.
- **Hérédité liée à l'X (Cas récessif - ex: Daltonisme, Hémophilie)** :
  - Les femmes sont conductrices saines si elles ont un seul X malade ($X_H X_h$). Elles doivent avoir les deux X malades pour exprimer le phénotype d'indisponibilité ($X_h X_h$).
  - Les hommes n'ayant qu'un seul chromosome X seront obligatoirement malades s'ils reçoivent l'allèle défectueux ($X_h Y$).`,
    keyPoints: [
      'L\'analyse d\'un arbre généalogique permet de repérer si un caractère est dominant ou récessif en observant si la maladie saute des générations.',
      'L\'allèle est gonosomal si la maladie affecte de manière disproportionnée les hommes ou les femmes.'
    ],
    keyFormulas: [
      'Femme conductrice : X_H X_h',
      'Homme atteint : X_h Y'
    ]
  },
  {
    id: 'histoire-geo-madagascar-colonisation',
    title: 'Madagascar pendant la Période Coloniale (1896-1960)',
    category: 'Histoire-Géo',
    series: ['A1', 'A2', 'C', 'D'],
    content: `### MADAGASCAR PENDANT LA PÉRIODE COLONIALE (1896-1960)

Ce cours d'Histoire retrace la mise en place de la tutelle administrative et économique de la France à Madagascar, le développement du sentiment nationaliste et les étapes vers le retour à l'indépendance de la Grande Île.

---

### 1. L’ANNEXION ET L'ORGANISATION COLONIALE (1895-1896)
Après la prise de Tananarive en septembre 1895, le traité du protectorat est signé. Le 6 août 1896, le Parlement français vote la loi d’annexion déclarant Madagascar colonie française.
- **L'action du Général Gallieni (Politique de pacification)** :
  - Abolition de la royauté Merina et exil de la Reine Ranavalona III.
  - Utilisation de la **politique "des races"** pour diviser les ethnies et affaiblir le gouvernement central.
  - Mise en place du **travail forcé (système du SMOTIG)** et de la fiscalité (l'impôt de capitation).

---

### 2. LA NAISSANCE ET L'ÉVOLUTION DU MOUVEMENT NATIONALISTE
- **Le mouvement Vy Vato Sakelika (V.V.S) en 1913** : Société secrète d’étudiants de l'école de médecine d'Ankatso luttant pour l’émancipation intellectuelle et nationale.
- **La création du M.D.R.M (Mouvement Démocratique de la Rénovation Malgache)** en 1946 par les députés Joseph Ravoahangy-Andrianavalona, Jacques Rabemananjara et Joseph Raseta, prônant l'indépendance par les urnes.

---

### 3. LES ÉVÉNEMENTS DU 29 MARS 1947 ET L'INDÉPENDANCE DE 1960
- **L’insurrection de 1947** : Une révolte armée éclate dans le pays (surtout dans l'Est). La répression de l'armée coloniale est foudroyante, causant de très nombreux morts.
- **La Loi-cadre Defferre (1956)** : Donne l'autonomie interne à Madagascar.
- **La proclamation de la République Malgache (14 octobre 1958)**.
- **La proclamation officielle de l'Indépendance** le **26 juin 1960** sous la présidence de Philibert Tsiranana.`,
    keyPoints: [
      'Retenir la date d\'annexion légale : 6 août 1896.',
      'Retenir la date de l\'Insurrection majeure : 29 mars 1947.',
      'Retenir la proclamation de l\'Indépendance : 26 juin 1960.'
    ],
    keyFormulas: [
      'Général Gallieni (Gouverneur général de 1896 à 1905)',
      'Philibert Tsiranana (Premier président de la République)'
    ]
  }
];
