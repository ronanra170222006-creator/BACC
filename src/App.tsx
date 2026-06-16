import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
// @ts-ignore
import studentsBg from './assets/images/students_bg_1781605755683.jpg';
import {
  BookOpen,
  FileText,
  User,
  GraduationCap,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  Send,
  LogOut,
  AlertCircle,
  Search,
  BookMarked,
  Layers,
  Phone,
  CreditCard,
  PlusCircle,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  Eye,
  Settings,
  Download,
  Smartphone,
  Camera,
  X
} from 'lucide-react';
import { baccLessons } from './lessonsData';
import { baccSubjects } from './subjectsData';
import {
  registerUser,
  loginUser,
  getUserStatus,
  submitPaymentReference,
  getAdminUsers,
  validateUserPayment,
  resetDatabase,
  explainWithAi,
  explainWithAiStream
} from './services/api';
import { User as AppUser, BaccSubject, Lesson, ChatMessage } from './types';

const localization = {
  fr: {
    title: "TERMINALE SERIE A, C, D, OSE, S, L ET TECHNIQUE",
    subtitle: "Ny fianarana no lovatsara indrindra",
    accueilTab: "Accueil",
    sujetsTab: "Sujets & Corrigés",
    coursTab: "Cours & Résumés",
    tuteurTab: "Tuteur IA Interactif",
    aboutTab: "À propos",
    logout: "Déconnexion",
    adminPanel: "Admin Panel",
    welcome: "👋 Bienvenue sur ta plateforme de révision BACC !",
    welcomeSub: "Ton compte a été validé avec succès par l'administrateur. Tout le programme officiel est à ta disposition pour assurer ton diplôme. Bon travail !",
    apkCardTitle: "📲 Étudie n'importe où avec l'application Android APK !",
    apkCardSub: "Télécharge notre APK officielle (seulement 5.4 Mo) pour pouvoir lire tes leçons et revoir les sujets BACC même lorsque l'électricité ou le réseau internet est instable. C'est idéal pour réviser à la maison ou sous l'arbre !",
    downloadApkBtn: "Télécharger l'APK (5.4 Mo)",
    downloadingApk: "Téléchargement...",
    apkSaved: "🎉 APK enregistrée ! Installez-la maintenant.",
    activeSmsRef: "Référence active :",
    searchPlaceholder: "Rechercher un sujet ou un mot clé...",
    filterCategory: "Matière :",
    filterSeries: "Série :",
    allOption: "Toutes",
    subjectCorrection: "Correction détaillée",
    subjectSubject: "Énoncé de l'épreuve",
    subjectSolutions: "Solutions types proposées",
    explanationBtn: "Explication IA",
    howToSolveBtn: "Comment résoudre cet exercice ?",
    showCorrectionBtn: "Afficher le corrigé",
    hideCorrectionBtn: "Masquer le corrigé",
    explainLessonAi: "Expliquer ce chapitre avec l'IA",
    lessonContent: "Contenu du cours",
    interactiveTutor: "Conseiller Pédagogique & Tuteur Virtuel BACC 2026",
    interactiveTutorDesc: "Pose toutes tes questions sur les cours ou les sujets d'examens officiels. Notre tuteur interactif te guidera pas à pas sans te juger.",
    chatPlaceholder: "Pose une question sur les suites, limites, philosophie, chimie...",
    sendBtn: "Poser la question à l'IA",
    startingTutorMsg: "Bonjour ! Je suis ton tuteur d'étude. Choisis un paragraphe ou pose-moi une question !",
    authWelcome: "Assure ton diplôme avec la méthode BACC !",
    authDesc: "Plateforme interactive conçue pour les élèves de Madagascar. Maîtrise le programme officiel grâce à des sujets types corrigés par des professeurs qualifiés.",
    statSuccess: "98% Satisfaits",
    statSuccessSub: "Amélioration mesurée",
    statCount: "250+ Corrigés",
    statCountSub: "Séries A, C, D, S, L...",
    apkTitle: "Téléchargement APK Direct",
    apkDesc: "Révise en toute liberté sans consommer trop de méga ! L'application fonctionne avec un minimum de connexion internet.",
    apkDownloadBtn: "Télécharger l'APK Gratuit (5.4 Mo)",
    authTitle: "INSCRIPTION OU CONNEXION DES ÉLÈVES AYANT RÉGLÉ LEUR DROIT",
    authSub: "Rejoins des milliers de candidats du baccalauréat",
    loginTab: "Se connecter",
    registerTab: "Créer un compte",
    emailOrUserLabel: "Adresse Email",
    emailOrUserPlaceholder: "exemple@gmail.com",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Ton mot de passe secret",
    nameLabel: "Nom complet officiel (ex: Ratsimazafy Jean)",
    phoneLabel: "Numéro de téléphone (Mvola, Airtel, Orange)",
    phonePlaceholder: "Par ex: 034 56 789 10 ou 038 72 030 22",
    passConfirmLabel: "Confirmer le mot de passe",
    forgotPass: "Mot de passe oublié ?",
    authActionLogin: "Me connecter maintenant",
    authActionRegister: "Créer mon espace élève",
    paymentTitle: "🔐 Espace de paiement requis pour activer ton compte",
    paymentDesc: "L'accès complet et illimité à toute la plateforme (Matières, Corrigés types complets, Sujets 2026, Tuteur IA interactif, Téléchargements PDF & Android) nécessite des frais de participation uniques.",
    choicePlan: "Choisis ta formule d'activation :",
    simplePlan: "Forfait Simple BACC (Révision & IA)",
    simplePrice: "15 000 Ariary",
    simpleDesc: "Accès complet à toutes les matières de ta série, sujets, cours officiels, et aux explications interactives du Tuteur IA.",
    specialPlan: "Forfait Spécial BACC 2026 (Accès Anticipé)",
    specialPrice: "30 000 Ariary",
    specialDesc: "Inclus l'accès complet + l'accès exclusif aux futurs sujets officiels du BACC 2026, publiés 2 jours avant l'épreuve !",
    paymentStep1: "📲 Étape 1 : Effectue ton dépôt Mobile Money",
    paymentStep2: "✍️ Étape 2 : Saisis la référence ou le message SMS de transaction",
    paymentStep2Desc: "Une fois le dépôt effectué au numéro ci-dessus, saisis la référence de transaction SMS reçue afin que l'administrateur valide ton compte.",
    paymentRefLabel: "Message SMS de transaction ou Référence unique",
    paymentRefPlaceholder: "Colle ici le SMS de confirmation ou la référence reçue",
    submitPaymentBtn: "Soumettre ma référence de paiement",
    submitPaymentLoading: "Vérification en cours...",
    pendingTitle: "⏳ Validation de ton paiement en cours",
    pendingDesc: "Ton paiement a été soumis avec succès à l'administration de Révision BACC Madagascar.",
    pendingWait: "L'un de nos professeurs agréés valide les transactions toutes les 15 minutes. N'hésite pas à rafraîchir la page ou à contacter l'administration par téléphone si besoin.",
    contactAdmin: "Contacter l'administration par téléphone :",
    refreshStatusBtn: "Rafraîchir mon statut d'accès",
    allMatiere: "Toutes",
    forfaitSp: "🔥 Forfait Spécial BACC 2026",
    forfaitSi: "💻 Forfait Simple (Révision & IA)",
    forfaitIn: "🔒 Compte Inactif",
    // Added bilingual fields
    studentLogin: "Connexion Étudiant",
    studentLoginSub: "Accède à ton espace de révision BACC.",
    studentRegister: "Créer mon compte Terminale",
    studentRegisterSub: "Remplis les informations ci-dessous pour t'inscrire.",
    emailLabel: "Adresse Email",
    emailPlaceholder: "Ex: prenom.nom@gmail.com",
    noAccountYet: "Pas encore de compte ?",
    createAccountHere: "Créer un compte ici",
    alreadyRegistered: "Déjà inscrit ?",
    loginHere: "Se connecter ici",
    howToUseTitle: "📚 Comment utiliser cette plateforme ?",
    baccSubjectsBox: "Sujets BACC",
    baccSubjectsBoxDesc: "Retrouve ici les anciens sujets d'examens officiels classés par matière et par série pour t'exercer en conditions réelles.",
    baccLessonsBox: "Leçons & Cours",
    baccLessonsBoxDesc: "Révise tes chapitres essentiels, tes formules de sciences et tes repères d'histoire grâce à des résumés clairs conformes au programme malgache.",
    baccTutorBox: "Tuteur IA (Explication)",
    baccTutorBoxDesc: "Pose toutes tes questions directement à l'Intelligence Artificielle. Elle utilise uniquement les leçons publiées sur ce site pour t'expliquer tes exercices étape par étape, sans te donner bêtement la réponse.",
    searchAndFilters: "Recherche et Filtres",
    searchAndSubjects: "Recherche et Matières",
    searchSubjectPlaceholder: "Rechercher un sujet ou un mot clé...",
    searchLessonPlaceholder: "Rechercher un cours...",
    matiereLabel: "Matière :",
    seriesLabel: "Série BACC :",
    solveWithAi: "Résoudre avec l'IA",
    correctionHintLabel: "Indice de correction",
    hideHintLabel: "Masquer l'indice",
    explainCourseWithAi: "Expliquer ce cours au Tuteur IA",
    clearChatHistory: "Effacer l'historique",
    noSubjectSelected: "Aucun sujet sélectionné",
    noSubjectSelectedSub: "Choisis l'un des sujets de la colonne de gauche classés par année et par série pour s'exercer en temps réel.",
    noLessonSelected: "Aucune leçon sélectionnée",
    noLessonSelectedSub: "Sélectionne un chapitre dans la liste de gauche pour réviser un résumé clair conforme au programme.",
    startChattingTutor: "Commence à discuter avec ton Tuteur IA",
    chattingTutorDesc: "Salue l'IA, ou choisis une leçon / un sujet d'examen et clique sur le bouton \"Résoudre avec l'IA\" !",
    activeStudyContext: "Contexte actif d'étude",
    activeLessonLabel: "Leçon active",
    activeSubjectLabel: "Sujet actif",
    noContextSelected: "Aucun document spécifique sélectionné. Le tuteur répondra d'une manière générale au programme du BACC malgache.",
    footerDisclaimer: "Conception et méthodologie calibrées pour le diplôme national de Madagascar. Tous droits réservés &copy; 2026.",
    optionBase: "Option de Base",
    optionSimple: "Option Simple",
    optionSpecial: "Offre Spéciale BACC 2026",
    alertPriceRise: "Attention : Ce prix passera à 30 000 Ar à seulement 5 jours du BACC !",
    paymentStep1Label: "1",
    paymentStep2Label: "2",
    choosePlanLabel: "Choisis ta formule d'activation :",
    submitPaymentLoadingText: "Envoi...",
    optionBasePriceTextSimple: "7 000 Ar",
    optionBaseDescSimple: "Accès complet aux leçons, sujets passés et explications par l'IA.",
    optionSpecialPriceText: "15 000 Ar",
    optionSpecialDesc: "Inclus tout l'accès classique + la section spéciale avec les sujets d'entraînement exclusifs publiés 2 jours avant le BACC.",
    paymentPendingTitle: "⏳ Vérification de ton paiement...",
    paymentPendingDesc: "Ton paiement a été soumis avec succès.",
    paymentPendingWait: "Un professeur certifié valide les références toutes les 15 minutes.",
    paymentPendingInfoTitle: "Informations envoyées",
    paymentPendingChosen: "Forfait Choisi :",
    paymentPendingRef: "Référence soumise :",
    paymentPendingWaitNote: "Note : Ton compte est actuellement en attente. L'administrateur va valider ton accès dans les plus brefs délais.",
    paymentPendingCheckAgain: "Vérifier à nouveau le statut",
  },
  mg: {
    title: "TERMINALES Madagasikara 2026",
    subtitle: "Ny fianarana no lovatsara indrindra",
    accueilTab: "Fandraisana",
    sujetsTab: "Lohahevitra & Valiny",
    coursTab: "Lesona & Famintinana",
    tuteurTab: "Mpampianatra IA",
    aboutTab: "Mombamomba",
    logout: "Hivoaka",
    adminPanel: "Espace Admin",
    welcome: "👋 Tonga soa amin'ny sehatry ny famerenana BACC !",
    welcomeSub: "Nankatoavin'ny mpitantana soa aman-tsara ny fandoavam-bolanao. Ny fandaharam-pianarana ofisialy rehetra dia azon'ity ampiasaina. Mazotoa mandalina !",
    apkCardTitle: "📲 Mianara na aiza na aiza miaraka amin'ny APK Android !",
    apkCardSub: "Ampidino ny APK ofisialy (5.4 Mo fotsiny) mba ahafahanao mamaky lesona sy mijery lohahevitra BACC na dia tsy misy internet na jiro aza. Tsara ho an'ny famerenana any an-trano na any an-tsaha !",
    downloadApkBtn: "Hampidina ny APK (5.4 Mo)",
    downloadingApk: "Eo am-pampidinana...",
    apkSaved: "🎉 Voatahiry ny APK! Azonao apetraka amin'ny finday izao.",
    activeSmsRef: "Kaody handoavam-bola :",
    searchPlaceholder: "Hitady lohahevitra na teny fanalahidy...",
    filterCategory: "Taranja :",
    filterSeries: "Sokajy :",
    allOption: "Rehetra",
    subjectCorrection: "Valiny amin'ny antsipiriany",
    subjectSubject: "Lohahevitra fotsiny",
    subjectSolutions: "Valiny natolotry ny mpampianatra",
    explanationBtn: "Fanazavana avy amin'ny IA",
    howToSolveBtn: "Ahoana no famahana ity fanazarana ity?",
    showCorrectionBtn: "Haneho ny valiny",
    hideCorrectionBtn: "Hanafina ny valiny",
    explainLessonAi: "Hazavao amin'ny alalan'ny IA ity toko ity",
    lessonContent: "Votoatin'ny lesona",
    interactiveTutor: "Mpanolotsaina & Mpampianatra Virtoaly BACC 2026",
    interactiveTutorDesc: "Mametraha fanontaniana momba ny lesona na lohahevitra fanadinana ofisialy rehetra. Hanampy sy hanoro anao tsikelikely ny mpanampy virtoaly.",
    chatPlaceholder: "Mametraha fanontaniana (Maths, Philosophie, Physique, SVT...)",
    sendBtn: "Handefa fanontaniana amin'ny IA",
    startingTutorMsg: "Salama ! Izaho no mpampianatra mpanampy anao. Misafidiana lesona na mametraha fanontaniana mivantana !",
    authWelcome: "Tantely amam-bahona ny BACC miaraka aminay !",
    authDesc: "Sehatra interactive natao hanampiana manokana ny mpianatra Malagasy Terminale. Fehezo ny fandaharam-pianarana ofisialy miaraka amin'ny valiny ofisialy.",
    statSuccess: "98% afa-po",
    statSuccessSub: "Fisondrotan'ny naoty",
    statCount: "250+ ny Valim-panadinana",
    statCountSub: "Sokajy A, C, D, S, L...",
    apkTitle: "Hampidina APK mivantana",
    apkDesc: "Mamerena amin'ny fotoana rehetra nefa tsy mandany méga be! Afaka mandeha na dia amin'ny internet ambany dia ambany aza.",
    apkDownloadBtn: "Hampidina ny APK Maimaimpoana (5.4 Mo)",
    authTitle: "FANORATANA ANARANA NA FIDIRANA HO AN'NY MPIADINA NAHASOAVINA NY SARANY",
    authSub: "Midira miaraka amin'ireo mpiadina BACC an'arivony",
    loginTab: "Hiditra",
    registerTab: "Hisoratra anarana",
    emailOrUserLabel: "Email na Anarana",
    emailOrUserPlaceholder: "Satria@gmail.com",
    passwordLabel: "Teny miafina",
    passwordPlaceholder: "Ny teny miafinao",
    nameLabel: "Anarana feno ofisialy (ohatra: Ratsimazafy Jean)",
    phoneLabel: "Laharana finday (Mvola, Airtel, Orange)",
    phonePlaceholder: "Ohatra: 034 56 789 10 na 038 72 030 22",
    passConfirmLabel: "Hamafiso ny teny miafina",
    forgotPass: "Hadino ny teny miafina?",
    authActionLogin: "Hiditra izao",
    authActionRegister: "Hanorina ny sehatro",
    paymentTitle: "🔐 Sehatra fandoavam-bola hampandehanana ny kaontinao",
    paymentDesc: "Mba hahazoana fidirana feno sy tsy misy fetra amin'ny sehatra rehetra (Taranja rehetra, Valim-panadinana feno, Sujets 2026, Mpampianatra IA, PDF & Android) dia misy sarany fandraisana anjara indray mandeha monja.",
    choicePlan: "Misafidiana ny tolotrao :",
    simplePlan: "Tolotra Tsotra BACC (Famerenana & IA)",
    simplePrice: "15 000 Ariary",
    simpleDesc: "Fidirana feno amin'ny taranja rehetra amin'ny sokajinao, lesona ofisialy ary mpampianatra IA mavitrika.",
    specialPlan: "Tolotra Spéciale BACC 2026",
    specialPrice: "30 000 Ariary",
    specialDesc: "Tafiditra ao ny fidirana feno + ny fahazoana mijery mialoha ireo ho lohahevitra BACC 2026, 2 andro mialohan'ny fanadinana ofisialy !",
    paymentStep1: "📲 Dingana 1 : Alefaso amin'ny finday ny sarany",
    paymentStep2: "✍️ Dingana 2 : Ampidiro ny kaody na ny SMS fandraisana fandoavam-bola",
    paymentStep2Desc: "Rehefa avy mandefa ny vola ianao dia ampidiro eto ny kaody transaction na ny SMS rehetra voaranao mba hanamafisan'ny mpitantana ny kaontinao.",
    paymentRefLabel: "SMS fandoavam-bola na Kaody Unique",
    paymentRefPlaceholder: "Adikao eto ny SMS na kaody azonao",
    submitPaymentBtn: "Handefa ny kaody fandoavam-bolako",
    submitPaymentLoading: "Eo am-panamarinana...",
    pendingTitle: "⏳ Eo am-panamarinana ny fandoavam-bolanao",
    pendingDesc: "Tafiditra soa aman-tsara any amin'ny fitondran-draharaha ny fandoavam-bolanao.",
    pendingWait: "Manamarina ny fandoavam-bola isaky ny 15 minitra ny mpampianatra mpiandraikitra. Azonao sivanina na rafresh-na ity pejy ity na miantso ny mpitantana amin'ny finday raha misy fahatarana.",
    contactAdmin: "Hiantso ny mpitantana amin'ny finday :",
    refreshStatusBtn: "Hamelombelona ny satan'ny kaontiko",
    allMatiere: "Rehetra",
    forfaitSp: "🔥 Tolotra Spéciale BACC 2026",
    forfaitSi: "💻 Tolotra Tsotra (Famerenana & IA)",
    forfaitIn: "🔒 Kaonty Tsy Mavitrika",
    // Added bilingual fields
    studentLogin: "Fidirana Mpianatra",
    studentLoginSub: "Idiro ny sehatra famerenana BACC-nao.",
    studentRegister: "Hanorina ny kaontiko Terminale",
    studentRegisterSub: "Fenoy ny mombamomba anao eto ambany hisoratana anarana.",
    emailLabel: "Adiresy Email",
    emailPlaceholder: "Ohatra: anarana@gmail.com",
    noAccountYet: "Tsy mbola manana kaonty ?",
    createAccountHere: "Hanorina kaonty eto",
    alreadyRegistered: "Efa voasoratra anarana ?",
    loginHere: "Hiditra eto",
    howToUseTitle: "📚 Ahoana no ampiasana ity sehatra ity ?",
    baccSubjectsBox: "Lohahevitra BACC",
    baccSubjectsBoxDesc: "Hita eto ireo lahadin'ny fanadinana ofisialy teo aloha voasokajy araka ny taranja sy sokajy mba ahafahanao mampitombo fahalalana.",
    baccLessonsBox: "Lesona & Famintinana",
    baccLessonsBoxDesc: "Mamerena ireo toko tena ilaina, ireo fomba siantifika ary ny tantara tianao ho fantatra amin'ny famintinana tsotra sy manaraka ny fandaharam-pianarana.",
    baccTutorBox: "Mpampianatra IA",
    baccTutorBoxDesc: "Mametraha fanontaniana mivantana amin'ny IA. Ny lesona navoaka teto ihany no ampiasainy hanazavana ny fomba famahana ny fanazaran-tenanao.",
    searchAndFilters: "Fikarohana & Sivana",
    searchAndSubjects: "Fikarohana & Taranja",
    searchSubjectPlaceholder: "Hikaroka lohahevitra...",
    searchLessonPlaceholder: "Hikaroka lesona...",
    matiereLabel: "Taranja :",
    seriesLabel: "Sokajy BACC :",
    solveWithAi: "Hamaha miaraka amin'ny IA",
    correctionHintLabel: "Toro-hevitra fotsiny",
    hideHintLabel: "Hanafina ny toro-hevitra",
    explainCourseWithAi: "Hazavao amin'ny alalan'ny IA ity",
    clearChatHistory: "Hamafa ny tantara",
    noSubjectSelected: "Tsy misy lohahevitra voafidy",
    noSubjectSelectedSub: "Misafidiana lohahevitra iray amin'ny ankavia voasokajy araka ny taona sy ny andiany mba hanaovana fanazarana.",
    noLessonSelected: "Tsy misy lesona voafidy",
    noLessonSelectedSub: "Misafidiana toko iray amin'ny ankavia mba hamakiana ny famintinana mazava mifanaraka amin'ny fandaharam-pianarana.",
    startChattingTutor: "Manombha miresaka amin'ny Mpampianatra IA",
    chattingTutorDesc: "Miarahaba ny IA, na misafidiana lesona / lohahevitra fanadinana ary tsindrio ny bokotra \"Hamaha miaraka amin'ny IA\" !",
    activeStudyContext: "Tontolon'ny lesona mavitrika",
    activeLessonLabel: "Lesona mavitrika",
    activeSubjectLabel: "Lohahevitra mavitrika",
    noContextSelected: "Tsy misy antontan-kevitra voafidy. Hamaly amin'ny ankapobeny ny mpampianatra.",
    footerDisclaimer: "Drafi-pampianarana BACC ofisialy eto Madagasikara. Zo rehetra voatokana &copy; 2026.",
    optionBase: "Safidy fototra",
    optionSimple: "Tolotra Tsotra",
    optionSpecial: "Tolotra Spéciale BACC 2026",
    alertPriceRise: "Fampitandremana: Hihakatra ho 30 000 Ar ity vidiny ity rehefa sisa 5 andro alohan'ny BACC !",
    paymentStep1Label: "1",
    paymentStep2Label: "2",
    choosePlanLabel: "Misafidiana ny tolotrao :",
    submitPaymentLoadingText: "Eo am-pandefasana...",
    optionBasePriceTextSimple: "7 000 Ar",
    optionBaseDescSimple: "Fidirana feno amin'ny lohahevitra amin'ny sokajinao, lesona ofisialy ary mpampianatra IA mavitrika.",
    optionSpecialPriceText: "15 000 Ar",
    optionSpecialDesc: "Afaka mampiasa ny taranja rehetra amin'ny SOKAJY REHETRA + Lohahevitra miavaka.",
    paymentPendingTitle: "⏳ Eo am-panamarinana ny fandoavam-bolanao...",
    paymentPendingDesc: "Tafiditra soa aman-tsara any amin'ny mpitantana ny fandoavam-bolanao.",
    paymentPendingWait: "Manamarina ny fandoavam-bola isaky ny 15 minitra ny mpitantana. Azonao sivanina ity pejy ity.",
    paymentPendingInfoTitle: "Mombamomba ny fandoavam-bola",
    paymentPendingChosen: "Tolotra voafidy :",
    paymentPendingRef: "Kaody nalefa :",
    paymentPendingWaitNote: "Fanamarihana: Eo am-panandrasana ny fidiran'ny kaontinao ianao izao. Hohamafisin'ny mpiandraikitra izany.",
    paymentPendingCheckAgain: "Hijerena ny satan'ny kaontiko indray",
  }
};

export default function App() {
  const [currentLang, setCurrentLang] = useState<'fr' | 'mg'>(() => {
    const saved = localStorage.getItem('bacc_lang');
    return (saved === 'mg' || saved === 'fr') ? saved : 'fr';
  });

  const toggleLanguage = (lang: 'fr' | 'mg') => {
    setCurrentLang(lang);
    localStorage.setItem('bacc_lang', lang);
  };

  const t = localization[currentLang];

  // Authentication & Session
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('bacc_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'admin'>('login');
  
  // Registration and Login credentials
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Admin login details
  const [adminId, setAdminId] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminToken, setAdminToken] = useState<{ adminId: string; adminPass: string } | null>(() => {
    const saved = localStorage.getItem('bacc_admin_token');
    return saved ? JSON.parse(saved) : null;
  });
  const [adminUsersList, setAdminUsersList] = useState<AppUser[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);

  // Paywall Reference inputs
  const [selectedPlan, setSelectedPlan] = useState<'simple' | 'speciale'>('simple');
  const [depositRef, setDepositRef] = useState('');

  // Status message alerts
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'err'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [apkDownloadProgress, setApkDownloadProgress] = useState<number | null>(null);
  const [apkDownloaded, setApkDownloaded] = useState<boolean>(false);

  // Student Main View Control
  const [activeTab, setActiveTab] = useState<'accueil' | 'sujets' | 'cours' | 'tuteur'>('accueil');

  // Filters for Subjects & Lessons
  const [subCategory, setSubCategory] = useState<string>('Toutes');
  const [subSeries, setSubSeries] = useState<string>('Toutes');
  const [subSearch, setSubSearch] = useState('');

  const [lessCategory, setLessCategory] = useState<string>('Toutes');
  const [lessSeries, setLessSeries] = useState<string>('Toutes');
  const [lessSearch, setLessSearch] = useState('');

  // Selected Detail views
  const [activeSubject, setActiveSubject] = useState<BaccSubject | null>(null);
  
  // Photo attachments state (Max 3)
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; data: string; mimeType: string }[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showSubjectHint, setShowSubjectHint] = useState(false);

  // AI Tutor Conversational state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('bacc_tutor_chat');
    return saved ? JSON.parse(saved) : [];
  });
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [contextLessonId, setContextLessonId] = useState<string | undefined>(undefined);
  const [contextSubjectId, setContextSubjectId] = useState<string | undefined>(undefined);
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'chatgpt'>(() => {
    const saved = localStorage.getItem('bacc_tutor_model');
    return (saved === 'chatgpt' || saved === 'gemini') ? saved : 'gemini';
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync state helpers
  useEffect(() => {
    localStorage.setItem('bacc_tutor_model', selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bacc_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bacc_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem('bacc_admin_token', JSON.stringify(adminToken));
    } else {
      localStorage.removeItem('bacc_admin_token');
    }
  }, [adminToken]);

  useEffect(() => {
    localStorage.setItem('bacc_tutor_chat', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Keep chat scrolled down
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatLoading]);

  // Trigger quick validation helper on mount for logged-in pending users
  useEffect(() => {
    if (currentUser && currentUser.status === 'pending') {
      pollUserStatus();
    }
  }, []);

  const triggerAlert = (type: 'success' | 'err', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 5000);
  };

  const pollUserStatus = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const updated = await getUserStatus(currentUser.email);
      setCurrentUser(updated);
      if (updated.status === 'validated') {
        triggerAlert('success', "Félicitations ! Ton accès a été validé avec succès par l'administrateur !");
      } else {
        triggerAlert('success', "Statut synchronisé. En attente de validation.");
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadApk = () => {
    if (apkDownloadProgress !== null) return;
    setApkDownloadProgress(0);
    setApkDownloaded(false);
    triggerAlert('success', "Téléchargement de l'APK Révision BACC en cours...");
    
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 18) + 7;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setApkDownloadProgress(null);
        setApkDownloaded(true);
        triggerAlert('success', "Téléchargement terminé ! Cliquez pour l'installer sur votre Android.");
        
        try {
          const blob = new Blob(["App de Révision BACC Terminale Madagascar 2026. Cette application Android vous permet de réviser avec moins de connexion internet."], { type: "application/vnd.android.package-archive" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Revision_BACC_Terminales.apk`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } catch (e) {
          console.error(e);
        }
      } else {
        setApkDownloadProgress(current);
      }
    }, 150);
  };

  // Auth Operations
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone || !regEmail || !regPass || !regConfirm) {
      triggerAlert('err', 'S’il te plaît, remplis tous les champs de saisie.');
      return;
    }
    if (regPass !== regConfirm) {
      triggerAlert('err', 'Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPass
      });
      setCurrentUser(res);
      triggerAlert('success', 'Compte créé avec succès ! Sélectionne maintenant ton option.');
      // After registration, reset forms
      setRegName('');
      setRegPhone('');
      setRegEmail('');
      setRegPass('');
      setRegConfirm('');
    } catch (err: any) {
      triggerAlert('err', err.message || "Erreur d'inscription.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPass) {
      triggerAlert('err', 'Adresse email et mot de passe requis.');
      return;
    }
    const trimmedInput = loginEmail.trim();
    if ((trimmedInput === 'Ratsimazafy' || trimmedInput.toLowerCase() === 'ratsimazafy') && loginPass === '17022006') {
      try {
        setLoading(true);
        const token = { adminId: 'Ratsimazafy', adminPass: '17022006' };
        // Test credentials with server
        const users = await getAdminUsers(token);
        setAdminToken(token);
        setAdminUsersList(users);
        triggerAlert('success', 'Bienvenue sur l’Espace d’Administration.');
        return;
      } catch (err: any) {
        triggerAlert('err', err.message || 'Identifiants d’administration erronés.');
        return;
      } finally {
        setLoading(false);
      }
    }
    try {
      setLoading(true);
      const res = await loginUser({ email: loginEmail, password: loginPass });
      setCurrentUser(res);
      triggerAlert('success', `Ravi de te revoir, ${res.name} !`);
    } catch (err: any) {
      triggerAlert('err', err.message || 'Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminId || !adminPass) {
      triggerAlert('err', 'Veuillez saisir les identifiants administrateur.');
      return;
    }
    if (adminId !== 'Ratsimazafy' || adminPass !== '17022006') {
      triggerAlert('err', 'Identifiant ou mot de passe incorrect.');
      return;
    }
    try {
      setLoading(true);
      const token = { adminId, adminPass };
      // Test credentials with server
      const users = await getAdminUsers(token);
      setAdminToken(token);
      setAdminUsersList(users);
      triggerAlert('success', 'Bienvenue sur l’Espace d’Administration.');
    } catch (err: any) {
      triggerAlert('err', err.message || 'Identifiants d’administration erronés.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setChatHistory([]);
    setActiveSubject(null);
    setActiveLesson(null);
    setContextLessonId(undefined);
    setContextSubjectId(undefined);
    triggerAlert('success', 'Déconnexion effectuée.');
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    setAdminUsersList([]);
    triggerAlert('success', 'Déconnexion administration effectuée.');
  };

  const fetchAdminUsers = async () => {
    if (!adminToken) return;
    try {
      setAdminLoading(true);
      const users = await getAdminUsers(adminToken);
      setAdminUsersList(users);
    } catch (err: any) {
      triggerAlert('err', err.message);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleValidateStudent = async (studentId: string) => {
    if (!adminToken) return;
    try {
      setAdminLoading(true);
      await validateUserPayment({
        adminId: adminToken.adminId,
        adminPass: adminToken.adminPass,
        userId: studentId
      });
      triggerAlert('success', 'Accès étudiant validé instantanément !');
      // refresh list
      await fetchAdminUsers();
    } catch (err: any) {
      triggerAlert('err', err.message);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleResetDatabase = async () => {
    if (!adminToken) return;
    if (!window.confirm("Êtes-vous certain de vouloir vider toutes les inscriptions de la base de données ?")) return;
    try {
      setAdminLoading(true);
      await resetDatabase({ adminId: adminToken.adminId, adminPass: adminToken.adminPass });
      triggerAlert('success', 'Base de données réinitialisée.');
      setAdminUsersList([]);
    } catch (err: any) {
      triggerAlert('err', err.message);
    } finally {
      setAdminLoading(false);
    }
  };

  // Submit payment reference
  const handlePaymentSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!depositRef) {
      triggerAlert('err', 'Veuillez renseigner le code référence SMS exact de votre dépôt Mobile Money.');
      return;
    }
    try {
      setLoading(true);
      const updated = await submitPaymentReference({
        email: currentUser.email,
        plan: selectedPlan,
        refSms: depositRef
      });
      setCurrentUser(updated);
      triggerAlert('success', 'Référence envoyée à l’administrateur ! Ton compte est en cours de validation.');
      setDepositRef('');
    } catch (err: any) {
      triggerAlert('err', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Send message to Tuteur IA
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || (!chatInput.trim() && attachedFiles.length === 0)) return;

    const userMsgText = chatInput.trim() || "[Photos associées]";
    // Build user message
    const newUserMsg: ChatMessage = {
      id: `${Date.now()}_u`,
      role: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      images: attachedFiles.map(img => img.data)
    };

    const updatedHistory = [...chatHistory, newUserMsg];
    setChatHistory(updatedHistory);
    
    // Copy and clear state immediately
    const currentUploaded = [...attachedFiles];
    setChatInput('');
    setAttachedFiles([]);
    setChatLoading(true);

    const assistantMessageId = `${Date.now()}_m`;
    const emptyModelMsg: ChatMessage = {
      id: assistantMessageId,
      role: 'model',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, emptyModelMsg]);

    try {
      await explainWithAiStream({
        email: currentUser.email,
        message: userMsgText,
        history: updatedHistory,
        contextLessonId,
        contextSubjectId,
        images: currentUploaded,
        model: selectedModel
      }, (chunk) => {
        setChatHistory(prev => prev.map(msg => {
          if (msg.id === assistantMessageId) {
            return { ...msg, text: msg.text + chunk };
          }
          return msg;
        }));
      });
    } catch (err: any) {
      triggerAlert('err', err.message || "Impossible d'obtenir une réponse de l'IA.");
      setChatHistory(prev => prev.filter(msg => msg.id !== assistantMessageId || msg.text.trim() !== ''));
    } finally {
      setChatLoading(false);
    }
  };

  // Quick action options
  const startTutorWithLesson = (lesson: Lesson) => {
    // Inject contextual message
    setContextLessonId(lesson.id);
    setContextSubjectId(undefined);
    setActiveTab('tuteur');
    const startMsg = `Salut Tuteur ! Peux-tu m'aider à comprendre le chapitre "${lesson.title}" (${lesson.category}) et m'expliquer la méthode pas à pas ?`;
    setChatInput(startMsg);
  };

  const sendDirectAiPrompt = async (promptText: string, customSubjectId?: string) => {
    if (!currentUser) return;
    setActiveTab('tuteur');
    setContextSubjectId(customSubjectId);
    setContextLessonId(undefined);
    
    const newUserMsg: ChatMessage = {
      id: `${Date.now()}_u`,
      role: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...chatHistory, newUserMsg];
    setChatHistory(updatedHistory);
    setChatLoading(true);

    const assistantMessageId = `${Date.now()}_m`;
    const emptyModelMsg: ChatMessage = {
      id: assistantMessageId,
      role: 'model',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, emptyModelMsg]);

    try {
      await explainWithAiStream({
        email: currentUser.email,
        message: promptText,
        history: updatedHistory,
        contextSubjectId: customSubjectId,
        model: selectedModel
      }, (chunk) => {
        setChatHistory(prev => prev.map(msg => {
          if (msg.id === assistantMessageId) {
            return { ...msg, text: msg.text + chunk };
          }
          return msg;
        }));
      });
    } catch (err: any) {
      triggerAlert('err', err.message || "Impossible d'obtenir une réponse de l'IA.");
      setChatHistory(prev => prev.filter(msg => msg.id !== assistantMessageId || msg.text.trim() !== ''));
    } finally {
      setChatLoading(false);
    }
  };

  const startTutorWithSubject = (sub: BaccSubject) => {
    const prompt = `Bonjour ! J'aimerais que tu traites ce sujet d'examen officiel de Madagascar : "${sub.name}". S'il te plaît, résous toutes les questions en détail et donne-moi l'intégralité du corrigé étape par étape avec les bons résultats.`;
    sendDirectAiPrompt(prompt, sub.id);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files) as File[];
    
    if (attachedFiles.length + files.length > 3) {
      triggerAlert('err', "Tu peux envoyer jusqu'à 3 photos maximum pour que le Tuteur les traite.");
      return;
    }

    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAttachedFiles(prev => [...prev, {
          name: file.name,
          data: base64String,
          mimeType: file.type
        }]);
      };
      reader.readAsDataURL(file);
    });
    
    e.target.value = '';
  };

  const clearChat = () => {
    if (window.confirm("Effacer tout l'historique avec le tuteur ?")) {
      setChatHistory([]);
      setContextLessonId(undefined);
      setContextSubjectId(undefined);
    }
  };

  const categories: string[] = ['Toutes', 'Maths', 'Physique-Chimie', 'SVT', 'Philosophie', 'Histoire-Géo', 'Malagasy', 'Français'];
  const seriesList: string[] = ['Toutes', 'A1', 'A2', 'C', 'D', 'OSE', 'S', 'L', 'Technique'];

  // Filter computation
  const filteredSubjects = baccSubjects.filter(sub => {
    const matchesCategory = subCategory === 'Toutes' || sub.category === subCategory;
    const matchesSeries = subSeries === 'Toutes' || sub.series === 'Toutes' || sub.series === subSeries;
    const matchesSearch = sub.name.toLowerCase().includes(subSearch.toLowerCase()) ||
                          sub.content.toLowerCase().includes(subSearch.toLowerCase());
    return matchesCategory && matchesSeries && matchesSearch;
  });

  const filteredLessons = baccLessons.filter(lesson => {
    const matchesCategory = lessCategory === 'Toutes' || lesson.category === lessCategory;
    const matchesSeries = lessSeries === 'Toutes' || lesson.series.includes(lessSeries as any) || lesson.series.includes('Toutes' as any);
    const matchesSearch = lesson.title.toLowerCase().includes(lessSearch.toLowerCase()) ||
                          lesson.content.toLowerCase().includes(lessSearch.toLowerCase());
    return matchesCategory && matchesSeries && matchesSearch;
  });

  return (
    <div 
      className="min-h-screen flex flex-col text-slate-150 relative bg-slate-950 font-sans-alt"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(8, 12, 24, 0.87), rgba(15, 23, 42, 0.93)), url(${studentsBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      
      {/* GLOBAL BANNER ALERTS */}
      <AnimatePresence>
        {alertMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-4 right-4 z-50 p-4 rounded-xl shadow-lg border-2 flex items-center gap-3 md:max-w-xl md:mx-auto ${
              alertMsg.type === 'success'
                ? 'bg-emerald-950/95 text-emerald-300 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] backdrop-blur-md'
                : 'bg-red-950/95 text-red-300 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] backdrop-blur-md'
            }`}
          >
            {alertMsg.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            )}
            <p className="text-sm font-bold">{alertMsg.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BAR */}
      <header className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white border-b-2 border-amber-500 shadow-[0_4px_30px_rgba(245,158,11,0.18)] backdrop-blur-md relative z-20">
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-amber-200 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2.5 rounded-xl text-slate-950 border-2 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse hover-shiver transition-transform" style={{ animationDuration: '4s' }}>
              <GraduationCap className="w-8 h-8 filter drop-shadow" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black font-display tracking-tight leading-none uppercase text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {t.title}
              </h1>
              <span className="text-[11px] text-amber-200/90 tracking-widest font-extrabold mt-1.5 block uppercase">
                👑 {t.subtitle} 👑
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Language Selector */}
            <div className="flex bg-indigo-900 p-1 rounded-xl border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <button
                type="button"
                onClick={() => toggleLanguage('fr')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  currentLang === 'fr'
                    ? 'bg-indigo-600 text-white border border-slate-955 shadow-sm'
                    : 'text-indigo-200 hover:text-white'
                }`}
              >
                <span className="text-sm">🇫🇷</span>
                <span>Français</span>
              </button>
              <button
                type="button"
                onClick={() => toggleLanguage('mg')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  currentLang === 'mg'
                    ? 'bg-indigo-600 text-white border border-slate-955 shadow-sm'
                    : 'text-indigo-200 hover:text-white'
                }`}
              >
                <span className="text-sm">🇲🇬</span>
                <span>Malagasy</span>
              </button>
            </div>

            {currentUser && (
              <div className="flex items-center gap-3 bg-gradient-to-r from-slate-900 to-indigo-950 px-4 py-2 rounded-xl border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] transition-all">
                <div className="w-8 h-8 rounded-full bg-indigo-600 border border-slate-950 flex items-center justify-center text-sm font-bold shadow-inner">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left text-xs">
                  <p className="font-semibold text-white leading-tight">{currentUser.name}</p>
                  <p className="text-indigo-300 leading-none text-[10px] font-bold">
                    {currentUser.plan === 'speciale' ? t.forfaitSp : currentUser.plan === 'simple' ? t.forfaitSi : t.forfaitIn}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 p-1.5 hover:bg-white/10 rounded-lg text-indigo-200 hover:text-rose-400 transition-all cursor-pointer border border-transparent hover:border-slate-800"
                  title={t.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {adminToken && (
              <div className="flex items-center gap-3 bg-rose-950/90 border-2 border-slate-950 px-4 py-2 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] transition-all">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-semibold text-rose-200">{t.adminPanel}</span>
                <button
                  onClick={handleAdminLogout}
                  className="p-1 hover:bg-rose-900 rounded text-rose-300 hover:text-white transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        
        {/* VIEW 1: ANONYMOUS / LOGIN & REGISTRATION & ADMIN ACCESS */}
        {!currentUser && !adminToken && (
          <div className="max-w-6xl mx-auto my-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT COLUMN: BRANDING & APK */}
            <div className="lg:col-span-12 xl:col-span-5 bg-slate-950/90 backdrop-blur-md rounded-3xl p-6 text-white flex flex-col justify-between relative overflow-hidden border-2 border-amber-500 shadow-[0_4px_30px_rgba(245,158,11,0.25)] hover:translate-y-[-2px] transition-all">
              <div className="absolute top-0 right-0 w-44 h-44 bg-amber-550/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 space-y-5">
                <div>
                  <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-[10px] text-slate-950 font-black px-3 py-1.5 rounded-full uppercase tracking-wider inline-block mb-3 shadow">
                    🇲🇬 Terminale 2026 officiel
                  </span>
                  <h3 className="text-xl md:text-2xl font-black font-display leading-tight text-white font-sans">
                    {t.authWelcome}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {t.authDesc}
                  </p>
                </div>

                {/* MOTIVATIONAL STATISTICS */}
                <div className="grid grid-cols-2 gap-3 bg-slate-900/95 p-4 rounded-xl border-2 border-amber-500/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-xs">
                  <div>
                    <span className="text-[9px] font-bold text-amber-400 block uppercase tracking-wider">Réussite Elevée</span>
                    <span className="text-xl font-black text-emerald-400 font-display">{t.statSuccess}</span>
                    <p className="text-[9px] text-slate-300 font-bold">{t.statSuccessSub}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-amber-400 block uppercase tracking-wider">Correction BACC</span>
                    <span className="text-xl font-black text-amber-400 font-display">{t.statCount}</span>
                    <p className="text-[9px] text-slate-300 font-bold">{t.statCountSub}</p>
                  </div>
                </div>


              </div>

              {/* Lovatsara footer */}
              <div className="border-t-2 border-amber-500/40 pt-3.5 mt-5 text-center lg:text-left relative z-10">
                <span className="text-[9px] text-amber-400 uppercase tracking-widest block font-display">Mantra de Réussite</span>
                <p className="text-sm font-bold text-amber-300 mt-0.5 italic font-display leading-tight">
                  " {t.subtitle} "
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: MAIN FORM AND NAVIGATION */}
            <div className="lg:col-span-12 xl:col-span-7 bg-slate-900/90 backdrop-blur-md rounded-3xl overflow-hidden border-2 border-amber-500 shadow-[0_4px_30px_rgba(245,158,11,0.25)] hover:translate-y-[-2px] transition-all flex flex-col justify-between text-slate-100">
              <div>
                <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 px-6 py-5 text-white relative overflow-hidden border-b-2 border-amber-500">
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-indigo-950/20 pointer-events-none" />
                  <div className="relative z-10 flex items-center gap-3">
                    <GraduationCap className="w-9 h-9 text-amber-400 flex-shrink-0 hover-shiver" />
                    <div>
                      <h2 className="text-sm font-black uppercase tracking-wide leading-tight text-amber-400">MAMASA ANAO HANORATRA ANARANA NA MIDITRA AVY HATRANY RAHA EFA NANDOA NY Droit</h2>
                      <p className="text-[11px] text-slate-300">Rejoins des milliers de candidats du baccalauréat</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
              {/* Tap switches */}
              <div className="flex bg-slate-950 p-1 rounded-xl mb-6 border-2 border-amber-500 shadow-[2px_2px_0px_0px_rgba(245,158,11,0.4)]">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 text-center py-2.5 text-sm font-extrabold rounded-lg transition-all cursor-pointer ${
                    authMode === 'login' ? 'bg-gradient-to-br from-amber-550 to-amber-600 text-slate-950 shadow-md border border-amber-250' : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  Connexion
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 text-center py-2.5 text-sm font-extrabold rounded-lg transition-all cursor-pointer ${
                    authMode === 'register' ? 'bg-gradient-to-br from-amber-550 to-amber-600 text-slate-950 shadow-md border border-amber-250' : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  Inscription
                </button>
              </div>

              {/* AUTH MODES RENDER */}
              <AnimatePresence mode="wait">
                {authMode === 'login' && (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onSubmit={handleLogin}
                    className="space-y-4"
                  >
                    <div>
                      <h3 className="text-lg font-black text-amber-400 font-display">Connexion Étudiant</h3>
                      <p className="text-xs text-slate-300 mb-4">Accède à ton espace de révision BACC.</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300 block">Adresse Email ou Nom d'utilisateur</label>
                      <input
                        type="text"
                        required
                        placeholder="exemple@gmail.com ou Ratsimazafy"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all text-sm font-bold shadow-inner"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300 block">Mot de passe</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all text-sm font-bold shadow-inner"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full text-slate-950 font-extrabold py-3.5 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-sm cursor-pointer shadow-[0_2px_10px_rgba(245,158,11,0.25)]"
                    >
                      {loading ? 'Connexion...' : 'Se connecter'}
                    </button>

                    <p className="text-center text-xs text-slate-400 mt-4">
                      Pas encore de compte ?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('register')}
                        className="text-amber-400 hover:underline font-extrabold"
                      >
                        Créer un compte ici
                      </button>
                    </p>
                  </motion.form>
                )}

                {authMode === 'register' && (
                  <motion.form
                    key="register"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onSubmit={handleRegister}
                    className="space-y-3.5"
                  >
                    <div>
                      <h3 className="text-lg font-black text-amber-400 font-display">Créer mon compte Terminale</h3>
                      <p className="text-xs text-slate-300">Remplis les informations ci-dessous pour t'inscrire.</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300 block">Nom et Prénom</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Jean Paul"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all text-sm font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300 block">Numéro de téléphone</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: 034 56 123 45"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all text-sm font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300 block">Adresse Email</label>
                      <input
                        type="email"
                        required
                        placeholder="prenom.nom@gmail.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all text-sm font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300 block">Mot de passe</label>
                      <input
                        type="password"
                        required
                        placeholder="Créer un mot de passe"
                        value={regPass}
                        onChange={(e) => setRegPass(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all text-sm font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300 block">Confirmer le mot de passe</label>
                      <input
                        type="password"
                        required
                        placeholder="Retape ton mot de passe"
                        value={regConfirm}
                        onChange={(e) => setRegConfirm(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all text-sm font-bold"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full text-slate-950 font-extrabold py-3.5 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-sm cursor-pointer shadow-[0_2px_10px_rgba(245,158,11,0.25)]"
                    >
                      {loading ? 'Inscription...' : "S'inscrire"}
                    </button>

                    <p className="text-center text-xs text-slate-500 mt-3">
                      Déjà inscrit ?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className="text-indigo-600 hover:underline font-semibold"
                      >
                        Se connecter ici
                      </button>
                    </p>
                  </motion.form>
                )}

                {authMode === 'admin' && (
                  <motion.form
                    key="admin"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onSubmit={handleAdminLogin}
                    className="space-y-4"
                  >
                    <div className="bg-rose-50 p-3 rounded-xl border border-rose-150 text-rose-800 flex items-start gap-2 mb-2">
                      <ShieldCheck className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold uppercase">Écran d’Administration</p>
                        <p className="text-[11px] leading-tight text-rose-700">Gestion des inscriptions et validation des dépôts de référence.</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 block">Identifiant Admin</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Ratsimazafy"
                        value={adminId}
                        onChange={(e) => setAdminId(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-250 focus:outline-none focus:ring-2 focus:ring-rose-505 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 block">Mot de passe</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-250 focus:outline-none focus:ring-2 focus:ring-rose-505 text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2.5 rounded-xl shadow-md transition-all text-sm disabled:opacity-50"
                    >
                      {loading ? 'Accès admin...' : 'Accéder au Panneau Admin'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              </div>
            </div>
          </div>
        </div>
      )}

        {/* VIEW 2: REGULAR STUDENT PAYWALL EXPLAINER */}
        {currentUser && currentUser.status === 'pending' && !currentUser.refSms && (
          <div className="max-w-xl mx-auto my-8 bg-slate-900/95 backdrop-blur-md text-slate-100 rounded-3xl border-2 border-amber-500 shadow-[0_4px_30px_rgba(245,158,11,0.25)] hover:translate-y-[-2px] transition-all overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 flex items-center gap-3 border-b-2 border-amber-400">
              <Lock className="w-7 h-7 flex-shrink-0 text-slate-950" />
              <div>
                <h2 className="text-xl font-black font-display leading-tight">🔒 Activation de ton compte</h2>
                <p className="text-xs text-slate-950 font-bold">Dernière étape pour débloquer tout le programme de révision !</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/25 shadow-inner">
                <p className="text-sm font-semibold text-slate-200 mb-3">Pour accéder aux sujets, aux leçons et au Tuteur IA, tu devez régler ton droit d’entrée.</p>
                
                <h4 className="text-xs font-black text-amber-400 uppercase mb-2 tracking-wider">💰 Choix de ton forfait :</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Forfait Simple */}
                  <label className={`block border-2 p-4 rounded-xl cursor-pointer transition-all ${
                    selectedPlan === 'simple' 
                      ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-450/30' 
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      <input 
                        type="radio" 
                        name="plan" 
                        checked={selectedPlan === 'simple'} 
                        onChange={() => setSelectedPlan('simple')}
                        className="mt-1 accent-amber-500 cursor-pointer"
                      />
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Option de Base</span>
                        <span className="text-sm font-black text-amber-300">Option Simple</span>
                        <span className="text-lg font-black block text-emerald-400 mt-1">15 000 Ar</span>
                        <p className="text-[11px] text-slate-350 mt-1 leading-tight">Accès complet à tous les sujets de ta série, cours théoriques officiels, et tuteur IA actif.</p>
                      </div>
                    </div>
                  </label>

                  {/* Forfait Special */}
                  <label className={`block border-2 p-4 rounded-xl cursor-pointer transition-all ${
                    selectedPlan === 'speciale' 
                      ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-450/30' 
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      <input 
                        type="radio" 
                        name="plan" 
                        checked={selectedPlan === 'speciale'} 
                        onChange={() => setSelectedPlan('speciale')}
                        className="mt-1 accent-amber-500 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="bg-gradient-to-r from-red-600 to-red-700 text-[9px] text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider">CONFIDENTIEL</span>
                        </div>
                        <span className="text-sm font-black text-amber-300 mt-1 block">Offre Spéciale BACC 2026</span>
                        <span className="text-lg font-black block text-emerald-400 mt-1">30 000 Ar</span>
                        <p className="text-[11px] text-slate-350 mt-1 leading-tight">Inclus tout l'accès classique + la section confidentielle spéciale contenant les futurs sujets BACC 2026 officialisés 2 jours avant l'examen officiel.</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* PAYMENT INSTRUCTIONS */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[11px] flex items-center justify-center font-black">1</span>
                    📲 Étape 1 : Effectue ton dépôt Mobile Money
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-7">
                    <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/30 hover:bg-yellow-500/20 transition-all text-yellow-300">
                      <p className="text-xs font-bold uppercase tracking-wider">Mvola (Telma)</p>
                      <p className="text-sm font-mono font-black mt-0.5">038 72 030 22</p>
                      <p className="text-[10px] text-yellow-400/80 mt-0.5">Nom d'enregistrement : Ratsimazafy</p>
                    </div>

                    <div className="bg-red-505/10 p-3 rounded-lg border border-red-500/30 hover:bg-red-500/20 transition-all text-red-350">
                      <p className="text-xs font-bold uppercase tracking-wider">Airtel Money</p>
                      <p className="text-sm font-mono font-black mt-0.5">033 09 104 25</p>
                      <p className="text-[10px] text-red-400/80 mt-0.5">Nom d'enregistrement : Ratsimazafy</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handlePaymentSubmission} className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-950 text-white text-[11px] flex items-center justify-center font-bold">2</span>
                    📝 Étape 2 : Envoie ta référence de dépôt
                  </h3>
                  <div className="pl-7 space-y-3.5">
                    <p className="text-xs text-slate-600 leading-tight">Une fois le dépôt effectué, saisis la référence de transaction ou le SMS exact ici pour que l'équipe valide ton accès :</p>
                    <div>
                      <input 
                        type="text"
                        required
                        placeholder="Ex: Référence de paiement Mvola / Airtel..."
                        value={depositRef}
                        onChange={(e) => setDepositRef(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-indigo-950 hover:bg-slate-900 text-white py-2.5 px-6 rounded-xl font-semibold shadow text-xs transition-all flex items-center gap-2"
                    >
                      {loading ? 'Envoi...' : 'Envoyer pour vérification'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 leading-normal flex gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Ton compte sera validé manuellement. Notre équipe compare les références fournies avec les logs réels pour déverrouiller l'accès.</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: DELAYED / PENDING ACCOUNT STATUS STATEMENTS */}
        {currentUser && currentUser.status === 'pending' && currentUser.refSms && (
          <div className="max-w-md mx-auto my-12 bg-slate-900/95 backdrop-blur-md text-slate-100 rounded-3xl overflow-hidden border-2 border-amber-500 shadow-[0_4px_30px_rgba(245,158,11,0.25)] hover:translate-y-[-2px] transition-all">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-6 text-center border-b-2 border-amber-400">
              <Clock className="w-12 h-12 mx-auto mb-3 animate-spin text-slate-950" style={{ animationDuration: '3s' }} />
              <h2 className="text-xl font-black font-display text-slate-950">⚠️ Compte en attente</h2>
              <p className="text-xs text-slate-950 font-bold mt-1">Dépôt envoyé en attente d’approbation de l'administrateur</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/30 shadow-inner">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Informations envoyées</span>
                <p className="text-sm font-bold text-slate-200 mt-1">Forfait Choisi : {currentUser.plan === 'speciale' ? 'Offre Spéciale BACC 2026' : 'Option Simple'}</p>
                <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg font-mono text-xs text-slate-350 mt-2">
                  <span className="text-slate-500 block text-[9px] uppercase font-sans">Référence soumise</span>
                  {currentUser.refSms}
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed text-center py-2">
                Note : Ton compte est actuellement en attente. L'administrateur va vérifier ton dépôt et valider ton accès dans les plus brefs délais.
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={pollUserStatus}
                  disabled={loading}
                  className="flex-1 text-slate-950 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 font-extrabold py-3 px-4 rounded-xl text-xs transition-with-shadow flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_2px_8px_rgba(245,158,11,0.25)]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Vérifier statut
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: ADMIN DASHBOARD */}
        {adminToken && (
          <div className="space-y-6">
            
            {/* Admin Controls bar */}
            <div className="bg-white border border-rose-150 p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-2xl font-bold font-display text-rose-950 flex items-center gap-2">
                  <ShieldCheck className="w-8 h-8 text-rose-600" />
                  Espace Administration - Gestion des Accès
                </h2>
                <p className="text-sm text-slate-500 mt-1">Gérez en direct les demandes de validation de paiement des élèves.</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={fetchAdminUsers}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-rose-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  Actualiser la liste
                </button>
                <button
                  onClick={handleResetDatabase}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  Réinitialiser DB
                </button>
              </div>
            </div>

            {/* Admin Stats layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-150">
                <span className="text-xs font-semibold text-slate-400 block uppercase">Total Inscrits</span>
                <span className="text-2xl font-bold text-slate-800 font-display mt-1">{adminUsersList.length}</span>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-150">
                <span className="text-xs font-semibold text-amber-600 block uppercase">En attente (Pending)</span>
                <span className="text-2xl font-bold text-amber-600 font-display mt-1">
                  {adminUsersList.filter(u => u.status === 'pending' && u.refSms).length}
                </span>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-150">
                <span className="text-xs font-semibold text-emerald-600 block uppercase">Accès Validés</span>
                <span className="text-2xl font-bold text-emerald-600 font-display mt-1">
                  {adminUsersList.filter(u => u.status === 'validated').length}
                </span>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-150">
                <span className="text-xs font-semibold text-indigo-600 block uppercase">Recettes estimées</span>
                <span className="text-2xl font-bold text-indigo-600 font-mono mt-1">
                  {adminUsersList
                    .filter(u => u.status === 'validated')
                    .reduce((total, u) => total + (u.plan === 'speciale' ? 30000 : u.plan === 'simple' ? 15000 : 0), 0)
                    .toLocaleString()}{' '}
                  Ar
                </span>
              </div>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h3 className="text-sm font-bold text-indigo-950 uppercase tracking-wide">Fiches Élèves & Validation</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-500 text-xs font-bold uppercase border-b border-slate-200">
                      <th className="p-4">Élève</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Forfait</th>
                      <th className="p-4">Référence dépôt SMS</th>
                      <th className="p-4">Statut</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-sm">
                    {adminUsersList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          Aucun étudiant inscrit pour le moment.
                        </td>
                      </tr>
                    ) : (
                      adminUsersList.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50">
                          <td className="p-4">
                            <div>
                              <p className="font-bold text-slate-900">{user.name}</p>
                              <p className="text-xs text-slate-400">{user.email}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-mono text-xs">{user.phone}</span>
                          </td>
                          <td className="p-4">
                            {user.plan === 'speciale' ? (
                              <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Spécial 2026 (15k)</span>
                            ) : user.plan === 'simple' ? (
                              <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Simple (7k)</span>
                            ) : (
                              <span className="text-slate-400 text-xs italic">Aucun forfait</span>
                            )}
                          </td>
                          <td className="p-4">
                            {user.refSms ? (
                              <span className="font-mono bg-amber-50 text-amber-900 border border-amber-200 text-xs px-2.5 py-1 rounded-lg block max-w-[200px] truncate" title={user.refSms}>
                                {user.refSms}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs font-serif italic">Non fournie</span>
                            )}
                          </td>
                          <td className="p-4">
                            {user.status === 'validated' ? (
                              <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full text-xs font-bold uppercase">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                Validé
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full text-xs font-bold uppercase">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                En attente
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            {user.status !== 'validated' && user.refSms ? (
                              <button
                                onClick={() => handleValidateStudent(user.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs tracking-wide transition-all"
                              >
                                Accepter
                              </button>
                            ) : (
                              <span className="text-slate-400 text-xs italic">Prêt</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: LOGGED IN VALIDATED STUDENT PANEL */}
        {currentUser && currentUser.status === 'validated' && (
          <div className="space-y-6">
            
            {/* NEW BACC WORKSPACE PAGES NAVIGATION */}
            <div className="grid grid-cols-2 lg:grid-cols-4 bg-slate-950 p-1.5 rounded-2xl border-2 border-amber-500 shadow-[0_4px_25px_rgba(245,158,11,0.25)] gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('accueil')}
                className={`py-3 px-2 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'accueil' 
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 border border-amber-250 shadow-md font-black' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50'
                }`}
              >
                <BookMarked className="w-4 h-4" />
                {t.accueilTab}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('sujets')}
                className={`py-3 px-2 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'sujets' 
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 border border-amber-250 shadow-md font-black' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50'
                }`}
              >
                <FileText className="w-4 h-4" />
                {t.sujetsTab}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('cours')}
                className={`py-3 px-2 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'cours' 
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 border border-amber-250 shadow-md font-black' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                {t.coursTab}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tuteur')}
                className={`py-3 px-2 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'tuteur' 
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 border border-amber-250 shadow-md font-black' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {t.tuteurTab}
              </button>
            </div>

            {/* TABS MULTI-PAGE RENDER */}
            <div className="transition-all duration-300">
              
              {/* PAGE 1: ACCUEIL / DASHBOARD */}
              {activeTab === 'accueil' && (
                <div className="space-y-6">
                  {/* WELCOME BLOCK */}
                  <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-slate-100 p-6 rounded-2xl border-2 border-emerald-500 shadow-[0_4px_30px_rgba(16,185,129,0.25)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 -mr-6 -mt-6 bg-emerald-500/10 w-28 h-28 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative z-10 flex gap-4">
                      <div className="bg-emerald-500/20 p-3 rounded-xl flex-shrink-0 self-start border border-emerald-500/30 hover-shiver">
                        <Sparkles className="w-8 h-8 text-amber-400 animate-bounce" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-black font-display text-amber-400 drop-shadow">{t.welcome}</h2>
                        <p className="text-sm text-slate-300 mt-1 leading-relaxed font-bold">
                          {t.welcomeSub}
                        </p>
                      </div>
                    </div>
                  </div>



                  {/* PLATFORM INSTRUCTION BLOCK ("À Propos") */}
                  <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-5 border-2 border-amber-500/50 shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
                    <h3 className="text-sm font-black text-amber-400 uppercase tracking-wide flex items-center gap-2 mb-3.5">
                      <BookMarked className="w-4 h-4 text-amber-400" />
                      {t.howToUseTitle}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 shadow-inner hover:border-amber-500/20 transition-all flex gap-3">
                        <div className="text-amber-400 mt-1">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider leading-none mb-1">{t.baccSubjectsBox}</h4>
                          <p className="text-xs text-slate-300 leading-normal font-bold">
                            {t.baccSubjectsBoxDesc}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 shadow-inner hover:border-amber-500/20 transition-all flex gap-3">
                        <div className="text-amber-400 mt-1">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider leading-none mb-1">{t.baccLessonsBox}</h4>
                          <p className="text-xs text-slate-300 leading-normal font-bold">
                            {t.baccLessonsBoxDesc}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 shadow-inner hover:border-amber-500/20 transition-all flex gap-3">
                        <div className="text-amber-400 mt-1">
                          <Sparkles className="w-5 h-5 pointer-events-none" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider leading-none mb-1">{t.baccTutorBox}</h4>
                          <p className="text-xs text-slate-300 leading-normal font-bold">
                            {t.baccTutorBoxDesc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 2: SUJETS BACC */}
              {activeTab === 'sujets' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column - List of subjects with filters */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="bg-slate-900/95 backdrop-blur-md p-5 rounded-2xl border border-amber-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                      <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <Search className="w-4 h-4" />
                        {t.searchAndFilters}
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Search keyword */}
                        <div className="relative">
                          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                          <input
                            type="text"
                            placeholder={t.searchSubjectPlaceholder}
                            value={subSearch}
                            onChange={(e) => setSubSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-150 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                          />
                        </div>

                        {/* Category filter */}
                        <div>
                          <label className="text-[10px] font-bold text-amber-400/80 uppercase tracking-wider block mb-1.5">{t.filterCategory}</label>
                          <select
                            value={subCategory}
                            onChange={(e) => setSubCategory(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs font-bold text-slate-300 focus:outline-none focus:border-amber-550 transition-all"
                          >
                            {categories.map(c => (
                              <option key={c} value={c} className="bg-slate-900">{c === 'Toutes' ? t.allOption : c}</option>
                            ))}
                          </select>
                        </div>

                        {/* Series filter */}
                        <div>
                          <label className="text-[10px] font-bold text-amber-400/80 uppercase tracking-wider block mb-1.5">{t.filterSeries}</label>
                          <select
                            value={subSeries}
                            onChange={(e) => setSubSeries(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs font-bold text-slate-300 focus:outline-none focus:border-amber-550 transition-all"
                          >
                            {seriesList.map(s => (
                              <option key={s} value={s} className="bg-slate-900">{s === 'Toutes' ? t.allOption : s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Grouped Subjects Listing - separated by date, subject and series */}
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                      {filteredSubjects.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 bg-slate-900/95 rounded-2xl border border-slate-800 text-xs">
                          {currentLang === 'mg' ? "Tsy misy lohahevitra mifanaraka amin'ireo sivana ireo." : "Aucun sujet ne correspond à ces critères."}
                        </div>
                      ) : (
                        // Grouping: Year -> Category -> Subjects list
                        Object.keys(
                          filteredSubjects.reduce((acc, sub) => {
                            const yGroup = sub.year;
                            if (!acc[yGroup]) acc[yGroup] = {};
                            const catGroup = sub.category;
                            if (!acc[yGroup][catGroup]) acc[yGroup][catGroup] = [];
                            acc[yGroup][catGroup].push(sub);
                            return acc;
                          }, {} as Record<number, Record<string, BaccSubject[]>>)
                        )
                        .map(Number)
                        .sort((a, b) => b - a) // Show most recent BACC first (Year/Date)
                        .map((yearKey) => {
                          const yearData = filteredSubjects.reduce((acc, s) => {
                            if (s.year === yearKey) {
                              const cName = s.category;
                              if (!acc[cName]) acc[cName] = [];
                              acc[cName].push(s);
                            }
                            return acc;
                          }, {} as Record<string, BaccSubject[]>);

                          return (
                            <div key={yearKey} className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 space-y-2.5 shadow-inner">
                              <div className="text-[10px] uppercase font-black text-amber-400 font-mono tracking-wider border-b border-slate-800/80 pb-1.5 flex items-center justify-between">
                                  <span>📅 {currentLang === 'mg' ? `Taona : ${yearKey}` : `Année : ${yearKey}`}</span>
                              </div>

                              <div className="space-y-3">
                                {Object.keys(yearData).map((cKey) => (
                                  <div key={cKey} className="space-y-1">
                                    <div className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-400 px-1">
                                      🏷️ {cKey}
                                    </div>
                                    <div className="space-y-1.5 font-sans">
                                      {yearData[cKey].map((sub) => {
                                        const isPremiumAndLocked = sub.isExclusive && currentUser.plan !== 'speciale';
                                        return (
                                          <button
                                            key={sub.id}
                                            type="button"
                                            onClick={() => {
                                              if (!isPremiumAndLocked) {
                                                setActiveSubject(sub);
                                                setShowSubjectHint(false);
                                              }
                                            }}
                                            className={`w-full text-left p-2.5 px-3 rounded-xl border transition-all relative flex flex-col gap-1 cursor-pointer ${
                                              activeSubject?.id === sub.id 
                                                ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 border-2 border-amber-300 font-bold shadow-md' 
                                                : isPremiumAndLocked 
                                                ? 'bg-slate-900 text-slate-500 border border-slate-955 cursor-not-allowed opacity-50' 
                                                : 'bg-slate-900 hover:bg-slate-800/90 text-slate-200 border-slate-800 hover:border-amber-500/25 transition-all'
                                            }`}
                                          >
                                            <div className="flex items-center justify-between gap-1 text-[9px] w-full">
                                              <span className={`font-bold px-1.5 py-0.25 rounded uppercase ${
                                                activeSubject?.id === sub.id ? 'bg-amber-800/20 text-amber-950 border border-amber-400/20' : 'bg-slate-950 text-slate-400 border border-slate-800'
                                              }`}>
                                                Série {sub.series}
                                              </span>
                                              {sub.isExclusive && (
                                                <span className={`font-semibold px-1 py-0.25 rounded-full ${
                                                  activeSubject?.id === sub.id ? 'bg-white text-rose-700' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                }`}>
                                                  🔥 Offre 2026
                                                </span>
                                              )}
                                            </div>

                                            <h4 className="text-[11px] font-bold font-display leading-tight line-clamp-2">
                                              {sub.name}
                                            </h4>

                                            {isPremiumAndLocked && (
                                              <div className="text-[9px] text-rose-600 font-bold flex items-center gap-1 justify-end">
                                                <Lock className="w-2.5 h-2.5 text-rose-600 animate-pulse" /> {currentLang === 'mg' ? "Voarara" : "Verrouillé"}
                                              </div>
                                            )}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Right Column - Subject Content viewer */}
                  <div className="lg:col-span-8 bg-slate-900/95 backdrop-blur-md p-6 rounded-3xl border-2 border-amber-500/30 shadow-[0_4px_30px_rgba(245,158,11,0.15)] transition-all min-h-[500px]">
                    {activeSubject ? (
                      <div className="space-y-6">
                        
                        {/* Title bar */}
                        <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="bg-amber-500/10 text-amber-300 text-xs font-black px-2.5 py-1 rounded-lg border border-amber-500/25">
                                {activeSubject.category}
                              </span>
                              <span className="text-xs text-slate-400 font-sans">
                                {currentLang === 'mg' ? 'Sokajy :' : 'Série :'} <strong className="text-amber-400">{activeSubject.series}</strong> | {currentLang === 'mg' ? 'Taona :' : 'Année :'} <strong className="text-amber-400">{activeSubject.year}</strong>
                              </span>
                            </div>
                            <h2 className="text-xl font-black text-white mt-2 font-display leading-tight">{activeSubject.name}</h2>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => startTutorWithSubject(activeSubject)}
                              className="text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-[0_2px_8px_rgba(245,158,11,0.35)] border border-amber-300"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              {t.solveWithAi}
                            </button>
                            <button
                              onClick={() => setShowSubjectHint(!showSubjectHint)}
                              className="bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-amber-550/30 transition-all cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              {showSubjectHint ? t.hideHintLabel : t.correctionHintLabel}
                            </button>
                          </div>
                        </div>

                        {/* Indice Section */}
                        <AnimatePresence>
                          {showSubjectHint && activeSubject.correctionHint && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2 text-xs"
                            >
                              <p className="font-bold text-amber-300 flex items-center gap-1">
                                <HelpCircle className="w-4 h-4 text-amber-500" /> 
                                {currentLang === 'mg' ? "Toro-hevitra fandoavam-baovao avy amin'ny mpampianatra :" : "Indice de guidage de correction du tuteur :"}
                              </p>
                              <p className="leading-relaxed text-slate-300 whitespace-pre-line">{activeSubject.correctionHint}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Markdown view content */}
                        <div className="markdown-body whitespace-pre-wrap font-sans text-slate-200">
                          {activeSubject.content}
                        </div>

                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-24 text-slate-500 space-y-4">
                        <FileText className="w-16 h-16 text-slate-600 stroke-[1.5]" />
                        <div>
                          <h4 className="text-base font-bold text-slate-400">{t.noSubjectSelected}</h4>
                          <p className="text-xs text-slate-505 mt-1 max-w-sm">{t.noSubjectSelectedSub}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PAGE 3: LEÇONS & COURS */}
              {activeTab === 'cours' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left filter side column */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="bg-slate-900/95 backdrop-blur-md p-5 rounded-2xl border border-amber-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                      <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                        <Search className="w-4 h-4" />
                        {t.searchAndSubjects}
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Search courses */}
                        <div className="relative">
                          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                          <input
                            type="text"
                            placeholder={t.searchLessonPlaceholder}
                            value={lessSearch}
                            onChange={(e) => setLessSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-150 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                          />
                        </div>

                        {/* Less category */}
                        <div>
                          <label className="text-[10px] font-bold text-amber-400/80 uppercase tracking-wider block mb-1.5">{t.filterCategory}</label>
                          <select
                            value={lessCategory}
                            onChange={(e) => setLessCategory(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs font-bold text-slate-300 focus:outline-none focus:border-amber-550 transition-all"
                          >
                            {categories.map(c => (
                              <option key={c} value={c} className="bg-slate-900">{c === 'Toutes' ? t.allOption : c}</option>
                            ))}
                          </select>
                        </div>

                        {/* Less Series */}
                        <div>
                          <label className="text-[10px] font-bold text-amber-400/80 uppercase tracking-wider block mb-1.5">{t.filterSeries}</label>
                          <select
                            value={lessSeries}
                            onChange={(e) => setLessSeries(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs font-bold text-slate-300 focus:outline-none focus:border-amber-550 transition-all"
                          >
                            {seriesList.map(s => (
                              <option key={s} value={s} className="bg-slate-900">{s === 'Toutes' ? t.allOption : s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Available lessons selection */}
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                      {filteredLessons.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 bg-slate-900/95 rounded-2xl border border-slate-800 text-xs">
                          Aucune leçon ou cours ne correspond à ces filtres.
                        </div>
                      ) : (
                        filteredLessons.map((less) => (
                          <button
                            key={less.id}
                            type="button"
                            onClick={() => {
                              setActiveLesson(less);
                            }}
                            className={`w-full text-left p-3.5 rounded-xl border transition-all relative flex flex-col gap-1.5 cursor-pointer ${
                              activeLesson?.id === less.id 
                                ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 border-2 border-amber-300 font-bold shadow-md' 
                                : 'bg-slate-900 hover:bg-slate-800/90 text-slate-200 border-slate-850 hover:border-amber-500/25 transition-all'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 text-[9px] w-full">
                              <span className={`font-bold px-1.5 py-0.25 rounded uppercase ${
                                activeLesson?.id === less.id ? 'bg-amber-800/20 text-slate-950 border border-amber-400/20' : 'bg-slate-950 text-slate-400 border border-slate-800'
                              }`}>
                                {less.category}
                              </span>
                              <p className="text-[9px] font-mono opacity-80">
                                Séries : {less.series.join(', ')}
                              </p>
                            </div>

                            <h4 className="text-[11px] font-bold font-display leading-tight line-clamp-2">
                              {less.title}
                            </h4>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right view panel for lesson material */}
                  <div className="lg:col-span-8 bg-slate-900/95 backdrop-blur-md p-6 rounded-3xl border-2 border-amber-500/30 shadow-[0_4px_30px_rgba(245,158,11,0.15)] transition-all min-h-[500px] text-slate-100">
                    {activeLesson ? (
                      <div className="space-y-6">
                        
                        {/* Title line */}
                        <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <span className="bg-amber-500/10 text-amber-300 border border-amber-500/25 text-xs font-black px-2.5 py-1 rounded-lg">
                              {activeLesson.category}
                            </span>
                            <h2 className="text-xl font-black text-white mt-2 font-display leading-tight">{activeLesson.title}</h2>
                            <p className="text-xs text-slate-400 mt-1">Conforme au programme et repères officiels de Madagascar ({activeLesson.series.join(', ')})</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => startTutorWithLesson(activeLesson)}
                            className="bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 font-extrabold px-4 py-2.5 rounded-xl border border-amber-300 text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_2px_8px_rgba(245,158,11,0.35)]"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            {t.explainCourseWithAi || "Expliquer ce cours au Tuteur IA"}
                          </button>
                        </div>

                        {/* Top formulas box if contains them */}
                        {((activeLesson.keyFormulas && activeLesson.keyFormulas.length > 0) || 
                          (activeLesson.keyPoints && activeLesson.keyPoints.length > 0)) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {activeLesson.keyPoints && activeLesson.keyPoints.length > 0 && (
                              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                  <BookMarked className="w-3.5 h-3.5 text-amber-400" /> Repères essentiels
                                </h4>
                                <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1 font-sans">
                                  {activeLesson.keyPoints.map((pt, i) => (
                                    <li key={i}>{pt}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {activeLesson.keyFormulas && activeLesson.keyFormulas.length > 0 && (
                              <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10">
                                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-2 flex items-center gap-1">
                                  <Layers className="w-3.5 h-3.5 text-amber-500" /> Formules Clés
                                </h4>
                                <div className="space-y-1 font-mono text-xs text-amber-200">
                                  {activeLesson.keyFormulas.map((form, i) => (
                                    <div key={i} className="bg-slate-950/80 border border-slate-850 p-1 px-2 rounded">
                                      {form}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>
                        )}

                        {/* Content Body of lesson summary */}
                        <div className="markdown-body whitespace-pre-wrap font-sans text-slate-200">
                          {activeLesson.content}
                        </div>

                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-24 text-slate-500 space-y-4">
                        <BookOpen className="w-16 h-16 text-slate-600 stroke-[1.5]" />
                        <div>
                          <h4 className="text-base font-bold text-slate-400">{t.noLessonSelected || "Aucune leçon sélectionnée"}</h4>
                          <p className="text-xs text-slate-505 mt-1 max-w-sm">{t.noLessonSelectedSub || "Sélectionne un chapitre dans la liste de gauche pour réviser un résumé clair conforme au programme."}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PAGE 4: TUTEUR IA (Explications) */}
              {activeTab === 'tuteur' && (
                <div className="bg-slate-900 border-2 border-amber-500/30 rounded-3xl shadow-[0_4px_30px_rgba(245,158,11,0.15)] overflow-hidden flex flex-col md:grid md:grid-cols-12 min-h-[580px]">
                  
                  {/* Sidebar Context Indicator */}
                  <div className="md:col-span-4 bg-slate-950/80 border-b md:border-b-0 md:border-r border-slate-800 p-5 flex flex-col justify-between">
                    <div className="space-y-5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                        <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest">{t.interactiveTutor || "Tuteur Pédagogique IA"}</h3>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {t.interactiveTutorDesc || "Ce tuteur utilise uniquement les leçons approuvées pour t'expliquer tes lacunes étape par étape, sans jamais te donner bêtement la réponse finale. Le but est de créer un déclic d'apprentissage."}
                      </p>

                      {/* Displaying active conversation context */}
                      <div className="space-y-3 pt-3 border-t border-slate-850">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block font-mono">{t.activeStudyContext}</span>

                        {contextLessonId ? (
                          <div className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 p-3 rounded-xl text-xs space-y-1 relative shadow-inner font-sans">
                            <span className="text-[9px] font-bold uppercase text-emerald-450 block">{t.activeLessonLabel}</span>
                            <p className="font-bold pr-5">{baccLessons.find(l => l.id === contextLessonId)?.title}</p>
                            <button
                              type="button"
                              onClick={() => setContextLessonId(undefined)}
                              className="absolute top-2.5 right-2 px-1 py-0.5 rounded text-emerald-450 hover:bg-rose-500/20 hover:text-rose-400 border border-emerald-550/30 text-[9px] flex items-center justify-center cursor-pointer font-bold"
                              title="Retirer le contexte"
                            >
                              ✕
                            </button>
                          </div>
                        ) : contextSubjectId ? (
                          <div className="bg-amber-500/10 text-amber-300 border border-amber-500/25 p-3 rounded-xl text-xs space-y-1 relative shadow-inner font-sans">
                            <span className="text-[9px] font-bold uppercase text-amber-400 block">{t.activeSubjectLabel}</span>
                            <p className="font-bold pr-5">{baccSubjects.find(s => s.id === contextSubjectId)?.name}</p>
                            <button
                              type="button"
                              onClick={() => setContextSubjectId(undefined)}
                              className="absolute top-2.5 right-2 px-1 py-0.5 rounded text-amber-400 hover:bg-rose-500/20 hover:text-rose-400 border border-amber-550/30 text-[9px] flex items-center justify-center cursor-pointer font-bold"
                              title="Retirer le contexte"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 italic font-sans">{t.noContextSelected}</p>
                        )}
                      </div>
                      {/* Model Selector Card */}
                      <div className="pt-4 border-t border-slate-850 space-y-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block font-mono">
                          Moteur d'intelligence (IA)
                        </span>
                        <div className="bg-slate-950 border border-slate-850 p-2 rounded-xl flex flex-col gap-1.5 shadow-inner">
                          <button
                            type="button"
                            onClick={() => setSelectedModel('gemini')}
                            className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between text-left cursor-pointer ${
                              selectedModel === 'gemini'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/35 shadow-sm'
                                : 'text-slate-400 hover:bg-slate-850 hover:text-slate-350 border border-transparent'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              Google Gemini
                            </span>
                            <span className={`text-[8px] font-bold uppercase rounded px-1.5 py-0.5 leading-none ${
                              selectedModel === 'gemini' ? 'bg-amber-500/30 text-amber-300' : 'bg-slate-800 text-slate-500'
                            }`}>
                              Recommandé
                            </span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setSelectedModel('chatgpt')}
                            className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between text-left cursor-pointer ${
                              selectedModel === 'chatgpt'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 shadow-sm'
                                : 'text-slate-400 hover:bg-slate-850 hover:text-slate-350 border border-transparent'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span className="text-emerald-450 font-bold text-xs">✦</span>
                              OpenAI ChatGPT
                            </span>
                            <span className={`text-[8px] font-bold uppercase rounded px-1.5 py-0.5 leading-none ${
                              selectedModel === 'chatgpt' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                            }`}>
                              Optionnel
                            </span>
                          </button>
                        </div>
                      </div>

                    </div>

                    <div className="pt-4 border-t border-slate-850 mt-6 flex flex-col gap-2">
                      <button
                        onClick={clearChat}
                        className="w-full border border-slate-800 hover:bg-slate-900 font-extrabold py-2 px-3 rounded-xl text-xs text-slate-300 transition-all flex items-center justify-center gap-1.5 hover:text-white cursor-pointer"
                      >
                        {t.clearChatHistory || "Effacer l'historique"}
                      </button>
                    </div>
                  </div>

                  {/* Messaging panel */}
                  <div className="md:col-span-8 flex flex-col justify-between bg-slate-950 h-[580px] relative">
                    
                    {/* Header bar */}
                    <div className="border-b border-slate-900 bg-slate-950/90 backdrop-blur px-5 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                        <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 font-mono">
                          Moteur Tuteur Actif :
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {selectedModel === 'gemini' ? (
                          <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            Google Gemini 1.5
                          </span>
                        ) : (
                          <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                            <span className="text-emerald-450">✦</span>
                            ChatGPT GPT-4o-mini
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Message Log */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                      {chatHistory.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                          <div className="bg-slate-900 p-4 rounded-full border border-slate-855 shadow-inner">
                            <GraduationCap className="w-10 h-10 text-slate-500 stroke-[1.5]" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-350">{t.startChattingTutor}</h4>
                            <p className="text-xs text-slate-500 mt-1 max-w-sm">{t.chattingTutorDesc}</p>
                          </div>
                        </div>
                      ) : (
                        chatHistory.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-xs leading-relaxed ${
                              msg.role === 'user'
                                ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-bold rounded-tr-none shadow-[0_2px_8px_rgba(245,158,11,0.3)]'
                                : 'bg-slate-900 text-slate-100 rounded-tl-none border border-slate-805 font-sans whitespace-pre-line'
                            }`}>
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                              {msg.images && msg.images.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {msg.images.map((imgUrl, i) => (
                                    <img
                                      key={i}
                                      src={imgUrl}
                                      alt="Photo devoir"
                                      className="w-20 h-20 object-cover rounded-lg border-2 border-slate-800 shadow bg-slate-900"
                                      referrerPolicy="no-referrer"
                                    />
                                  ))}
                                </div>
                              )}
                              <div className={`text-[8.5px] mt-1.5 block text-right font-mono ${
                                msg.role === 'user' ? 'text-amber-950/75' : 'text-slate-500'
                              }`}>
                                {msg.timestamp}
                              </div>
                            </div>
                          </div>
                        ))
                      )}

                      {chatLoading && (
                        <div className="flex justify-start">
                          <div className="bg-slate-900 text-slate-300 border border-slate-850 rounded-2xl rounded-tl-none p-4 max-w-[80%] flex items-center gap-2">
                            <div className="flex gap-1 flex-shrink-0">
                              <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-[11px] text-slate-400 italic">Le tuteur IA prépare son explication méthodique...</span>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input form */}
                    <div className="border-t border-slate-850 bg-slate-900/90 backdrop-blur flex flex-col p-3">
                      
                      {/* Attached images preview list */}
                      {attachedFiles.length > 0 && (
                        <div className="p-2 mb-2 bg-slate-950 rounded-xl border border-slate-850 flex flex-wrap gap-2">
                          {attachedFiles.map((f, idx) => (
                            <div key={idx} className="relative bg-slate-900 border border-slate-800 rounded-lg p-1.5 flex items-center gap-2 pr-7 shadow">
                              <img src={f.data} className="w-8 h-8 object-cover rounded border border-slate-755" alt="Thumbnail" />
                              <span className="text-[9px] font-bold text-slate-300 max-w-[120px] truncate">{f.name}</span>
                              <button
                                type="button"
                                onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                                className="absolute right-1 top-2 text-rose-500 hover:text-rose-450 focus:outline-none font-bold"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                        {/* Hidden file input */}
                        <input
                          type="file"
                          id="chat-photo-upload"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        
                        {/* Photo Attach Button */}
                        <button
                          type="button"
                          onClick={() => document.getElementById('chat-photo-upload')?.click()}
                          title="Ajouter des photos (max 3)"
                          className="bg-slate-900 hover:bg-slate-850 text-emerald-450 p-3 rounded-xl border border-slate-804 shadow flex items-center justify-center cursor-pointer transition-all active:translate-y-[1px] relative flex-shrink-0"
                        >
                          <Camera className="w-4 h-4 text-emerald-450" />
                          {attachedFiles.length > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-black text-[9px] rounded-full w-4.5 h-4.5 flex items-center justify-center border border-slate-955 scale-90">
                              {attachedFiles.length}
                            </span>
                          )}
                        </button>

                        <input
                          type="text"
                          required={attachedFiles.length === 0}
                          disabled={chatLoading}
                          placeholder={contextSubjectId ? "Pose ta question ou décris la photo..." : t.chatPlaceholder}
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          className="flex-1 px-4 py-3 bg-slate-950 border border-slate-805 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
                        />

                        <button
                          type="submit"
                          disabled={chatLoading || (!chatInput.trim() && attachedFiles.length === 0)}
                          className="bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 p-3 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 cursor-pointer flex-shrink-0 shadow-[0_2px_8px_rgba(245,158,11,0.3)] font-sans"
                        >
                          <Send className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                        </button>
                      </form>
                    </div>

                  </div>

                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* FOOTER ACCREDITATION DISPLAY */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-850 text-xs mt-12 bg-indigo-950/95">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <p className="font-bold text-slate-200">📚 TERMINAL Serie A, C, D , OSE , S , L ET TECHNIQUE</p>
            <p className="text-sm font-semibold text-emerald-400 mt-1 italic font-display">“ Ny fianarana no lovatsara indrindra ”</p>
            <p className="text-[10px] text-slate-400 mt-2 opacity-85">Conception et méthodologie calibrées pour le diplôme national de Madagascar. Tous droits réservés &copy; 2026.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
