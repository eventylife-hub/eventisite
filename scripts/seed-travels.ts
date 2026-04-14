/**
 * Seed 10 voyages réalistes + 10 profils Créateurs
 * Usage: npx ts-node scripts/seed-travels.ts
 *        ou: cd backend && npx prisma db seed (si configuré)
 *
 * Crée : 10 Users (PRO), 10 ProProfiles (CREATOR), 10 Travels (PUBLISHED),
 *        3 TravelOccurrences par voyage = 30 occurrences.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const argon2 = require('argon2');

type UserRole = 'CLIENT' | 'PRO' | 'ADMIN';
type TravelStatus = 'DRAFT' | 'PUBLISHED' | 'SALES_OPEN';

async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: 2 /* argon2id */, memoryCost: 65536, timeCost: 3, parallelism: 4 });
}

const prisma = new PrismaClient();

// ════════════════════════════════════════════════════════════════════
// DONNÉES DES 10 VOYAGES + CRÉATEURS
// ════════════════════════════════════════════════════════════════════

interface CreatorData {
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  proSlug: string;
  bio: string;
  specialties: string[];
  avatarUrl: string;
}

interface TravelData {
  title: string;
  slug: string;
  destination: string;
  country: string;
  duration: number;
  price: number; // EUR TTC
  capacity: number;
  description: string;
  theme: string;
  coverImage: string;
  gallery: string[];
  program: Array<{ day: string; date: string; title: string; slots: Array<{ icon: string; label: string; text: string }> }>;
  included: string[];
  excluded: string[];
  uniquePoints: string[];
  creatorMessage: string;
  lat: number;
  lng: number;
}

const CREATORS: CreatorData[] = [
  {
    firstName: 'Sarah', lastName: 'Dumont', email: 'sarah.dumont@eventylife.fr',
    displayName: 'Sarah Dumont', proSlug: 'sarah-dumont-voyages-maroc',
    bio: 'Spécialiste Maroc depuis 8 ans. 31 voyages organisés, note 4.9/5. Passionnée de gastronomie marocaine et de randonnée dans l\'Atlas.',
    specialties: ['Maroc', 'Gastronomie', 'Trekking'],
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  },
  {
    firstName: 'Sofia', lastName: 'Papadopoulos', email: 'sofia.p@eventylife.fr',
    displayName: 'Sofia P.', proSlug: 'sofia-grece-iles',
    bio: 'Née à Athènes, j\'organise des voyages dans les Cyclades depuis 5 ans. Chaque île a son secret, je vous les révèle.',
    specialties: ['Grèce', 'Îles', 'Culture'],
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
  },
  {
    firstName: 'Ahmed', lastName: 'Bensaid', email: 'ahmed.b@eventylife.fr',
    displayName: 'Ahmed Bensaid', proSlug: 'ahmed-asie-aventure',
    bio: 'Explorateur Asie du Sud-Est. 40+ voyages entre Bali, Thaïlande et Vietnam. Guide francophone certifié.',
    specialties: ['Bali', 'Indonésie', 'Aventure'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
  {
    firstName: 'Marie', lastName: 'Lefevre', email: 'marie.l@eventylife.fr',
    displayName: 'Marie Lefevre', proSlug: 'marie-portugal-gourmand',
    bio: 'Sommelière et passionnée de cuisine portugaise. Mes voyages sont une immersion gustative de Lisbonne à Porto.',
    specialties: ['Portugal', 'Gastronomie', 'Vin'],
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
  },
  {
    firstName: 'Yuki', lastName: 'Tanaka', email: 'yuki.t@eventylife.fr',
    displayName: 'Yuki Tanaka', proSlug: 'yuki-japon-authentique',
    bio: 'Franco-japonaise, j\'ouvre les portes du Japon authentique. Temples, onsen, izakaya... loin des circuits touristiques.',
    specialties: ['Japon', 'Culture', 'Temples'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
  },
  {
    firstName: 'Giulia', lastName: 'Rossi', email: 'giulia.r@eventylife.fr',
    displayName: 'Giulia Rossi', proSlug: 'giulia-italie-dolcevita',
    bio: 'Romaine de naissance, je partage la dolce vita authentique. Rome, Florence, Naples — mes adresses secrètes depuis 10 ans.',
    specialties: ['Italie', 'Histoire', 'Gastronomie'],
    avatarUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&q=80',
  },
  {
    firstName: 'Emre', lastName: 'Yilmaz', email: 'emre.y@eventylife.fr',
    displayName: 'Emre Yilmaz', proSlug: 'emre-istanbul-orient',
    bio: 'Né à Istanbul, guide certifié. Je fais le pont entre Orient et Occident. Bazars, hammams, Bosphore — la Turquie vraie.',
    specialties: ['Turquie', 'Istanbul', 'Orient'],
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
  },
  {
    firstName: 'Fatima', lastName: 'Al Rashid', email: 'fatima.a@eventylife.fr',
    displayName: 'Fatima Al Rashid', proSlug: 'fatima-dubai-luxe',
    bio: 'Spécialiste des Émirats et du luxe accessible. Dubaï, Abu Dhabi, désert — je crée des expériences 5 étoiles à prix juste.',
    specialties: ['Dubaï', 'Luxe', 'Désert'],
    avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80',
  },
  {
    firstName: 'Carlos', lastName: 'Garcia', email: 'carlos.g@eventylife.fr',
    displayName: 'Carlos Garcia', proSlug: 'carlos-barcelone-fiesta',
    bio: 'Barcelonais d\'adoption, DJ et guide. Mes voyages mêlent culture catalane, plages et vie nocturne légendaire.',
    specialties: ['Espagne', 'Barcelone', 'Fête'],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
  },
  {
    firstName: 'Karim', lastName: 'Benali', email: 'karim.b@eventylife.fr',
    displayName: 'Karim Benali', proSlug: 'karim-essaouira-zen',
    bio: 'Surfeur et yogi, j\'ai trouvé mon paradis à Essaouira. Vent, vagues, méditation et gastronomie de la côte atlantique.',
    specialties: ['Maroc', 'Surf', 'Bien-être'],
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
  },
];

const TRAVELS: TravelData[] = [
  // 0 — Marrakech Express (déjà en fallback, on le crée aussi en base)
  {
    title: 'Marrakech Express', slug: 'marrakech-express',
    destination: 'Marrakech', country: 'Maroc', duration: 7, price: 899, capacity: 42,
    description: '7 jours d\'immersion totale à Marrakech et dans le Haut-Atlas. Riad 4★, gastronomie, trek, hammam, souks — tout est inclus.',
    theme: 'culture', coverImage: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80', 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&q=80', 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80'],
    program: [
      { day: 'J1', date: '10 mai', title: 'Départ France → Marrakech', slots: [{ icon: '🚌', label: 'Matin', text: 'Ramassage porte-à-porte' }, { icon: '🌙', label: 'Soir', text: 'Arrivée riad, thé de bienvenue' }] },
      { day: 'J2', date: '11 mai', title: 'Médina & Palais', slots: [{ icon: '☀️', label: 'Matin', text: 'Palais Bahia + Koutoubia' }, { icon: '🏺', label: 'Après-midi', text: 'Souks + Tanneries' }] },
      { day: 'J3', date: '12 mai', title: 'Atlas & Villages', slots: [{ icon: '🥾', label: 'Journée', text: 'Trek VIP Haut-Atlas' }] },
      { day: 'J4', date: '13 mai', title: 'Aventure & Bien-être', slots: [{ icon: '🏍️', label: 'Matin', text: 'Quad palmeraie' }, { icon: '🛁', label: 'Après-midi', text: 'Hammam & Spa' }] },
      { day: 'J5', date: '14 mai', title: 'Essaouira', slots: [{ icon: '🐟', label: 'Journée', text: 'Excursion Essaouira — plage & médina' }] },
      { day: 'J6', date: '15 mai', title: 'Jardins & Dernière soirée', slots: [{ icon: '🌿', label: 'Matin', text: 'Majorelle + YSL' }, { icon: '🥂', label: 'Soir', text: 'Dîner La Mamounia' }] },
      { day: 'J7', date: '16 mai', title: 'Retour France', slots: [{ icon: '🚌', label: 'Journée', text: 'Route retour' }] },
    ],
    included: ['Bus porte-à-porte', '6 nuits riad 4★', '5 dîners', 'Trek Atlas', 'Hammam', 'Quad', 'Majorelle', 'Pack Sérénité'],
    excluded: ['Déjeuners libres', 'Pourboires', 'Assurance annulation renforcée'],
    uniquePoints: ['Dîner à La Mamounia', 'Trek Atlas VIP avec guide berbère', 'Riad 4★ sélectionné par Sarah'],
    creatorMessage: 'Marrakech, c\'est un voyage qui te change. 3 ans de recherche pour trouver les bonnes adresses.',
    lat: 31.6295, lng: -7.9811,
  },
  // 1 — Santorin Sunset
  {
    title: 'Santorin Sunset', slug: 'santorin-sunset',
    destination: 'Santorin', country: 'Grèce', duration: 5, price: 1290, capacity: 30,
    description: '5 jours de rêve à Santorin. Couchers de soleil à Oia, plages volcaniques, gastronomie grecque et croisière caldera.',
    theme: 'romantique', coverImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80', 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80'],
    program: [
      { day: 'J1', date: '15 juin', title: 'Arrivée Santorin', slots: [{ icon: '✈️', label: 'Après-midi', text: 'Vol Paris-Santorin, transfert hôtel' }, { icon: '🌅', label: 'Soir', text: 'Premier coucher de soleil à Oia' }] },
      { day: 'J2', date: '16 juin', title: 'Fira & Caldera', slots: [{ icon: '🏛️', label: 'Matin', text: 'Visite Fira, musée préhistorique' }, { icon: '⛵', label: 'Après-midi', text: 'Croisière caldera + volcan' }] },
      { day: 'J3', date: '17 juin', title: 'Plages & Vin', slots: [{ icon: '🏖️', label: 'Matin', text: 'Plage Red Beach' }, { icon: '🍷', label: 'Après-midi', text: 'Dégustation vignoble Santo Wines' }] },
      { day: 'J4', date: '18 juin', title: 'Akrotiri & Libre', slots: [{ icon: '🏺', label: 'Matin', text: 'Site archéologique Akrotiri' }, { icon: '☀️', label: 'Après-midi', text: 'Temps libre plage Kamari' }] },
      { day: 'J5', date: '19 juin', title: 'Retour', slots: [{ icon: '✈️', label: 'Matin', text: 'Transfert aéroport, vol retour' }] },
    ],
    included: ['Vol A/R Paris-Santorin', '4 nuits hôtel 4★ vue caldera', 'Croisière caldera', 'Transferts', 'Petits-déjeuners', '3 dîners', 'Dégustation vin'],
    excluded: ['Déjeuners', 'Pourboires', 'Assurance voyage'],
    uniquePoints: ['Hôtel avec vue directe sur la caldera', 'Coucher de soleil privé à Oia', 'Croisière caldera avec baignade source chaude'],
    creatorMessage: 'Santorin au coucher du soleil, c\'est la Grèce dans toute sa magie. J\'y retourne chaque année.',
    lat: 36.3932, lng: 25.4615,
  },
  // 2 — Bali Découverte
  {
    title: 'Bali Découverte', slug: 'bali-decouverte',
    destination: 'Bali', country: 'Indonésie', duration: 10, price: 2190, capacity: 24,
    description: '10 jours à Bali entre rizières, temples, volcans et plages. Ubud, Seminyak, Nusa Penida — le meilleur de l\'île des Dieux.',
    theme: 'aventure', coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80', 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80'],
    program: [
      { day: 'J1', date: '1 sept', title: 'Arrivée Bali', slots: [{ icon: '✈️', label: 'Soir', text: 'Arrivée Denpasar, transfert Ubud' }] },
      { day: 'J2-J4', date: '2-4 sept', title: 'Ubud — Cœur culturel', slots: [{ icon: '🌿', label: 'Multi', text: 'Rizières Tegallalang, Monkey Forest, temples, cours cuisine' }] },
      { day: 'J5-J6', date: '5-6 sept', title: 'Volcans & Cascades', slots: [{ icon: '🌋', label: 'Multi', text: 'Lever soleil Mont Batur, cascade Sekumpul' }] },
      { day: 'J7-J8', date: '7-8 sept', title: 'Nusa Penida', slots: [{ icon: '🏝️', label: 'Multi', text: 'Île paradisiaque, Kelingking Beach, snorkeling manta' }] },
      { day: 'J9', date: '9 sept', title: 'Seminyak — Plage & Détente', slots: [{ icon: '🏖️', label: 'Journée', text: 'Beach club, spa, shopping' }] },
      { day: 'J10', date: '10 sept', title: 'Retour', slots: [{ icon: '✈️', label: 'Matin', text: 'Vol retour' }] },
    ],
    included: ['Vol A/R', '9 nuits hôtels 3-4★', 'Tous transferts', 'Guide francophone', '9 PDJ + 5 dîners', 'Activités incluses', 'Bateau Nusa Penida'],
    excluded: ['Déjeuners libres', 'Visa on arrival 35$', 'Pourboires'],
    uniquePoints: ['Lever soleil Mont Batur (1717m)', 'Snorkeling avec raies manta', 'Cours de cuisine balinaise'],
    creatorMessage: 'Bali m\'a adopté il y a 8 ans. Ce voyage, c\'est mon Bali secret — loin du tourisme de masse.',
    lat: -8.4095, lng: 115.1889,
  },
  // 3 — Lisbonne Gourmande
  {
    title: 'Lisbonne Gourmande', slug: 'lisbonne-gourmande',
    destination: 'Lisbonne', country: 'Portugal', duration: 4, price: 890, capacity: 36,
    description: '4 jours gourmands à Lisbonne. Pastéis de nata, azulejos, fado, et croisière sur le Tage.',
    theme: 'gastronomie', coverImage: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80', 'https://images.unsplash.com/photo-1569959220744-ff553533f492?w=800&q=80'],
    program: [
      { day: 'J1', date: '20 mai', title: 'Arrivée Lisbonne', slots: [{ icon: '✈️', label: 'Matin', text: 'Vol, transfert hôtel Alfama' }, { icon: '🎵', label: 'Soir', text: 'Soirée Fado + dîner' }] },
      { day: 'J2', date: '21 mai', title: 'Belém & Gastronomie', slots: [{ icon: '🏛️', label: 'Matin', text: 'Tour de Belém, Jerónimos' }, { icon: '🍰', label: 'Après-midi', text: 'Atelier pastéis + Time Out Market' }] },
      { day: 'J3', date: '22 mai', title: 'Sintra & Cascais', slots: [{ icon: '🏰', label: 'Journée', text: 'Palais de Pena, Quinta da Regaleira, Cascais' }] },
      { day: 'J4', date: '23 mai', title: 'Alfama & Retour', slots: [{ icon: '🚋', label: 'Matin', text: 'Tram 28, São Jorge, shopping' }, { icon: '✈️', label: 'Après-midi', text: 'Vol retour' }] },
    ],
    included: ['Vol A/R', '3 nuits hôtel 4★ Alfama', 'Soirée Fado', 'Atelier pastéis', 'Sintra excursion', 'Transferts', '3 PDJ + 2 dîners'],
    excluded: ['Déjeuners', 'Tram 28 (inclus abonnement)', 'Boissons hors repas'],
    uniquePoints: ['Atelier pastéis de nata avec chef', 'Soirée Fado authentique à Alfama', 'Excursion Sintra + Cascais'],
    creatorMessage: 'Lisbonne, c\'est l\'émotion du fado et le goût des pastéis. Un concentré de bonheur en 4 jours.',
    lat: 38.7223, lng: -9.1393,
  },
  // 4 — Tokyo Mystique
  {
    title: 'Tokyo Mystique', slug: 'tokyo-mystique',
    destination: 'Tokyo', country: 'Japon', duration: 8, price: 3490, capacity: 20,
    description: '8 jours entre tradition et modernité à Tokyo et Kyoto. Temples, onsen, izakayas, Harajuku — le Japon authentique.',
    theme: 'culture', coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80', 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80'],
    program: [
      { day: 'J1', date: '10 oct', title: 'Arrivée Tokyo', slots: [{ icon: '✈️', label: 'Soir', text: 'Arrivée Narita, transfert Shinjuku' }] },
      { day: 'J2-J3', date: '11-12 oct', title: 'Tokyo Moderne', slots: [{ icon: '🏙️', label: 'Multi', text: 'Shibuya, Harajuku, Akihabara, Tsukiji' }] },
      { day: 'J4', date: '13 oct', title: 'Shinkansen → Kyoto', slots: [{ icon: '🚄', label: 'Matin', text: 'Bullet train Tokyo-Kyoto' }, { icon: '⛩️', label: 'Après-midi', text: 'Fushimi Inari' }] },
      { day: 'J5-J6', date: '14-15 oct', title: 'Kyoto — Temples', slots: [{ icon: '🏯', label: 'Multi', text: 'Kinkaku-ji, Arashiyama, geishas Gion, cérémonie du thé' }] },
      { day: 'J7', date: '16 oct', title: 'Nara & Onsen', slots: [{ icon: '🦌', label: 'Matin', text: 'Parc aux cerfs Nara' }, { icon: '♨️', label: 'Soir', text: 'Onsen traditionnel' }] },
      { day: 'J8', date: '17 oct', title: 'Retour', slots: [{ icon: '✈️', label: 'Matin', text: 'Shinkansen Kyoto-Tokyo, vol retour' }] },
    ],
    included: ['Vol A/R Paris-Tokyo', 'Japan Rail Pass 7 jours', '7 nuits hôtels/ryokan', 'Guide francophone', 'Activités incluses', '7 PDJ + 4 dîners', 'Onsen + Cérémonie du thé'],
    excluded: ['Déjeuners libres', 'Métro Tokyo supplément', 'Shopping personnel'],
    uniquePoints: ['Nuit en ryokan traditionnel avec onsen', 'Cérémonie du thé privée à Kyoto', 'Dîner omakase dans izakaya secrète'],
    creatorMessage: 'Le Japon, c\'est un autre monde. Ce voyage ouvre des portes que les touristes ne voient jamais.',
    lat: 35.6762, lng: 139.6503,
  },
  // 5 — Rome Éternelle
  {
    title: 'Rome Éternelle', slug: 'rome-eternelle',
    destination: 'Rome', country: 'Italie', duration: 5, price: 990, capacity: 34,
    description: '5 jours à Rome entre Colisée, Vatican, trattorias secrètes et dolce vita. La Ville Éternelle comme vous ne l\'avez jamais vue.',
    theme: 'histoire', coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&q=80', 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800&q=80'],
    program: [
      { day: 'J1', date: '5 avr', title: 'Arrivée Rome', slots: [{ icon: '✈️', label: 'Matin', text: 'Vol, transfert Trastevere' }, { icon: '🍝', label: 'Soir', text: 'Dîner trattoria familiale' }] },
      { day: 'J2', date: '6 avr', title: 'Rome Antique', slots: [{ icon: '🏛️', label: 'Matin', text: 'Colisée + Forum coupe-file' }, { icon: '⛲', label: 'Après-midi', text: 'Panthéon, Fontaine de Trevi, Place d\'Espagne' }] },
      { day: 'J3', date: '7 avr', title: 'Vatican', slots: [{ icon: '🎨', label: 'Matin', text: 'Musées Vatican + Chapelle Sixtine VIP' }, { icon: '⛪', label: 'Après-midi', text: 'Basilique St-Pierre, coupole' }] },
      { day: 'J4', date: '8 avr', title: 'Trastevere & Gastronomie', slots: [{ icon: '🍕', label: 'Matin', text: 'Cours de pâtes fraîches' }, { icon: '🛵', label: 'Après-midi', text: 'Tour Vespa dans Rome' }] },
      { day: 'J5', date: '9 avr', title: 'Retour', slots: [{ icon: '☕', label: 'Matin', text: 'Dernier espresso + shopping' }, { icon: '✈️', label: 'Après-midi', text: 'Vol retour' }] },
    ],
    included: ['Vol A/R', '4 nuits hôtel 4★ Trastevere', 'Colisée + Vatican coupe-file', 'Tour Vespa', 'Cours cuisine', '4 PDJ + 3 dîners'],
    excluded: ['Déjeuners', 'Gelato (on ne peut pas s\'arrêter)', 'Pourboires'],
    uniquePoints: ['Visite Vatican VIP avant ouverture', 'Tour Vespa dans les ruelles de Rome', 'Cours de pâtes avec nonna romaine'],
    creatorMessage: 'Roma non basta una vita. Rome, une vie ne suffit pas. Ce voyage, c\'est ma Rome secrète.',
    lat: 41.9028, lng: 12.4964,
  },
  // 6 — Istanbul Oriental
  {
    title: 'Istanbul Oriental', slug: 'istanbul-oriental',
    destination: 'Istanbul', country: 'Turquie', duration: 6, price: 1390, capacity: 28,
    description: '6 jours entre Orient et Occident. Bosphore, Grand Bazar, Sainte-Sophie, hammams et gastronomie turque d\'exception.',
    theme: 'culture', coverImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80', 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=80'],
    program: [
      { day: 'J1', date: '2 juin', title: 'Arrivée Istanbul', slots: [{ icon: '✈️', label: 'Soir', text: 'Arrivée, transfert Sultanahmet' }] },
      { day: 'J2', date: '3 juin', title: 'Istanbul Historique', slots: [{ icon: '🕌', label: 'Matin', text: 'Sainte-Sophie + Mosquée Bleue' }, { icon: '🏰', label: 'Après-midi', text: 'Palais Topkapi' }] },
      { day: 'J3', date: '4 juin', title: 'Bosphore', slots: [{ icon: '⛵', label: 'Journée', text: 'Croisière Bosphore + rive asiatique' }] },
      { day: 'J4', date: '5 juin', title: 'Bazars & Hammam', slots: [{ icon: '🛍️', label: 'Matin', text: 'Grand Bazar + Bazar Égyptien' }, { icon: '🛁', label: 'Après-midi', text: 'Hammam historique Çemberlitaş' }] },
      { day: 'J5', date: '6 juin', title: 'Cappadoce Express', slots: [{ icon: '🎈', label: 'Journée', text: 'Vol intérieur + montgolfière + vallées' }] },
      { day: 'J6', date: '7 juin', title: 'Retour', slots: [{ icon: '✈️', label: 'Matin', text: 'Vol retour Paris' }] },
    ],
    included: ['Vol A/R Paris-Istanbul', '5 nuits hôtels 4★', 'Croisière Bosphore', 'Hammam', 'Vol intérieur Cappadoce', 'Montgolfière', '5 PDJ + 4 dîners'],
    excluded: ['Déjeuners', 'Shopping bazar', 'Pourboires'],
    uniquePoints: ['Montgolfière au lever du soleil en Cappadoce', 'Hammam historique du 16e siècle', 'Dîner sur le Bosphore au coucher du soleil'],
    creatorMessage: 'Istanbul est la ville la plus fascinante du monde. Ce voyage, c\'est le pont entre deux mondes.',
    lat: 41.0082, lng: 28.9784,
  },
  // 7 — Dubaï Luxe
  {
    title: 'Dubaï Luxe', slug: 'dubai-luxe',
    destination: 'Dubaï', country: 'Émirats Arabes Unis', duration: 5, price: 2890, capacity: 22,
    description: '5 jours de luxe accessible à Dubaï. Burj Khalifa, désert, marina, brunch palace et expériences exclusives.',
    theme: 'luxe', coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80', 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&q=80'],
    program: [
      { day: 'J1', date: '15 nov', title: 'Arrivée Dubaï', slots: [{ icon: '✈️', label: 'Soir', text: 'Arrivée, transfert JBR' }, { icon: '🌃', label: 'Nuit', text: 'Dîner Marina vue skyline' }] },
      { day: 'J2', date: '16 nov', title: 'Dubaï Moderne', slots: [{ icon: '🏙️', label: 'Matin', text: 'Burj Khalifa At The Top + Dubai Mall' }, { icon: '🏖️', label: 'Après-midi', text: 'Plage JBR + Marina Walk' }] },
      { day: 'J3', date: '17 nov', title: 'Désert & Traditions', slots: [{ icon: '🐪', label: 'Après-midi', text: 'Safari désert 4x4 + dunes bashing' }, { icon: '🌅', label: 'Soir', text: 'Dîner bédouin sous les étoiles' }] },
      { day: 'J4', date: '18 nov', title: 'Abu Dhabi', slots: [{ icon: '🕌', label: 'Journée', text: 'Grande Mosquée Sheikh Zayed + Louvre Abu Dhabi' }] },
      { day: 'J5', date: '19 nov', title: 'Brunch & Retour', slots: [{ icon: '🥂', label: 'Matin', text: 'Brunch 5★ Atlantis The Palm' }, { icon: '✈️', label: 'Soir', text: 'Vol retour' }] },
    ],
    included: ['Vol A/R', '4 nuits hôtel 5★ JBR', 'Burj Khalifa VIP', 'Safari désert premium', 'Abu Dhabi excursion', 'Brunch Atlantis', '4 PDJ + 3 dîners'],
    excluded: ['Déjeuners', 'Shopping', 'Boissons alcoolisées hors repas'],
    uniquePoints: ['Brunch royal à l\'Atlantis The Palm', 'Safari désert privé au coucher du soleil', 'Vue depuis le 148e étage du Burj Khalifa'],
    creatorMessage: 'Dubaï, c\'est le futur qui se vit au présent. Luxe, désert, traditions — un cocktail unique.',
    lat: 25.2048, lng: 55.2708,
  },
  // 8 — Barcelone Vibrante
  {
    title: 'Barcelone Vibrante', slug: 'barcelone-vibrante',
    destination: 'Barcelone', country: 'Espagne', duration: 4, price: 790, capacity: 38,
    description: '4 jours de fiesta à Barcelone. Gaudí, tapas, plage, Boquería et vie nocturne catalane.',
    theme: 'festif', coverImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1564221710304-0b37c8b9d729?w=800&q=80', 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800&q=80'],
    program: [
      { day: 'J1', date: '12 juil', title: 'Arrivée Barcelone', slots: [{ icon: '✈️', label: 'Matin', text: 'Vol, transfert Eixample' }, { icon: '🍷', label: 'Soir', text: 'Tapas tour Barri Gòtic' }] },
      { day: 'J2', date: '13 juil', title: 'Gaudí & Gothic', slots: [{ icon: '⛪', label: 'Matin', text: 'Sagrada Família coupe-file' }, { icon: '🎨', label: 'Après-midi', text: 'Park Güell + Casa Batlló' }] },
      { day: 'J3', date: '14 juil', title: 'Plage & Boquería', slots: [{ icon: '🏖️', label: 'Matin', text: 'Plage Barceloneta' }, { icon: '🥘', label: 'Après-midi', text: 'Marché Boquería + cours paella' }] },
      { day: 'J4', date: '15 juil', title: 'Montjuïc & Retour', slots: [{ icon: '🏰', label: 'Matin', text: 'Montjuïc + Fondation Miró' }, { icon: '✈️', label: 'Après-midi', text: 'Vol retour' }] },
    ],
    included: ['Vol A/R', '3 nuits hôtel 4★ Eixample', 'Sagrada Família + Park Güell coupe-file', 'Cours paella', 'Tapas tour', '3 PDJ + 2 dîners'],
    excluded: ['Déjeuners', 'Vie nocturne', 'Shopping'],
    uniquePoints: ['Cours de paella avec chef catalan', 'Sagrada Família visite VIP matin', 'Tapas tour secret dans le Barri Gòtic'],
    creatorMessage: 'Barcelone, c\'est l\'énergie pure. Gaudí, la mer, les tapas, la fête — tout dans une même ville.',
    lat: 41.3874, lng: 2.1686,
  },
  // 9 — Essaouira Zen
  {
    title: 'Essaouira Zen', slug: 'essaouira-zen',
    destination: 'Essaouira', country: 'Maroc', duration: 5, price: 1190, capacity: 26,
    description: '5 jours de détente totale à Essaouira. Surf, yoga, méditation, gastronomie océane et couchers de soleil atlantiques.',
    theme: 'bien-etre', coverImage: 'https://images.unsplash.com/photo-1569383746724-6f1b882b8de8?w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80', 'https://images.unsplash.com/photo-1540611025311-01df3cef54b5?w=800&q=80'],
    program: [
      { day: 'J1', date: '22 sept', title: 'Arrivée Essaouira', slots: [{ icon: '✈️', label: 'Après-midi', text: 'Vol Marrakech + transfert' }, { icon: '🌅', label: 'Soir', text: 'Coucher soleil remparts + dîner fruits de mer' }] },
      { day: 'J2', date: '23 sept', title: 'Surf & Yoga', slots: [{ icon: '🏄', label: 'Matin', text: 'Cours de surf (tous niveaux)' }, { icon: '🧘', label: 'Après-midi', text: 'Yoga sunset sur la plage' }] },
      { day: 'J3', date: '24 sept', title: 'Médina & Artisanat', slots: [{ icon: '🎨', label: 'Matin', text: 'Galeries, thuya, artisans' }, { icon: '🐟', label: 'Après-midi', text: 'Port, grillades poisson frais' }] },
      { day: 'J4', date: '25 sept', title: 'Détente & Hammam', slots: [{ icon: '🛁', label: 'Matin', text: 'Hammam + massage' }, { icon: '📸', label: 'Après-midi', text: 'Balade photographique médina' }] },
      { day: 'J5', date: '26 sept', title: 'Retour', slots: [{ icon: '🧘', label: 'Matin', text: 'Yoga sunrise final' }, { icon: '✈️', label: 'Après-midi', text: 'Transfert + vol retour' }] },
    ],
    included: ['Vol A/R via Marrakech', '4 nuits riad vue mer', 'Cours surf', 'Yoga quotidien', 'Hammam + massage', '4 PDJ + 3 dîners fruits de mer'],
    excluded: ['Déjeuners', 'Location planche perso', 'Shopping'],
    uniquePoints: ['Yoga sunrise sur la plage atlantique', 'Cours de surf avec moniteur certifié', 'Riad avec vue directe sur l\'océan'],
    creatorMessage: 'Essaouira, c\'est le Maroc zen. Le vent, les vagues, le silence... Un reset total pour l\'esprit.',
    lat: 31.5085, lng: -9.7595,
  },
];

// ════════════════════════════════════════════════════════════════════
// SEED FUNCTION
// ════════════════════════════════════════════════════════════════════

async function seedTravels() {
  console.log('🌱 Seed 10 voyages + 10 profils Créateurs...\n');

  const hashedPassword = await hashPassword('Creator123!');

  for (let i = 0; i < CREATORS.length; i++) {
    const creator = CREATORS[i];
    const travel = TRAVELS[i];

    console.log(`  ${i + 1}/10 — ${travel.title} (${creator.displayName})`);

    // 1. Create User (PRO)
    const user = await prisma.user.upsert({
      where: { email: creator.email },
      update: {},
      create: {
        email: creator.email,
        passwordHash: hashedPassword,
        role: 'PRO' as UserRole,
        firstName: creator.firstName,
        lastName: creator.lastName,
        avatarUrl: creator.avatarUrl,
        emailVerifiedAt: new Date(),
        isActive: true,
      },
    });

    // 2. Create ProProfile (CREATOR)
    const proProfile = await prisma.proProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        proType: 'CREATOR',
        proStatuses: ['ACTIVE'],
        validationStatus: 'APPROVED',
        displayName: creator.displayName,
        proSlug: creator.proSlug,
        bio: creator.bio,
        onboardingCompletedAt: new Date(),
      },
    });

    // 3. Create Travel (PUBLISHED)
    const departureDate = new Date();
    departureDate.setMonth(departureDate.getMonth() + 1);
    const returnDate = new Date(departureDate);
    returnDate.setDate(returnDate.getDate() + travel.duration - 1);

    const createdTravel = await prisma.travel.upsert({
      where: { slug: travel.slug },
      update: {},
      create: {
        title: travel.title,
        slug: travel.slug,
        description: travel.description,
        summary: travel.description.substring(0, 200),
        proProfileId: proProfile.id,
        status: 'PUBLISHED' as TravelStatus,
        departureDate,
        returnDate,
        departureCity: 'Paris',
        destinationCity: travel.destination,
        destinationCountry: travel.country,
        transportMode: travel.price > 2000 ? 'AVION' : 'BUS',
        capacity: travel.capacity,
        pricePerPersonTTC: travel.price * 100, // centimes
        coverImageUrl: travel.coverImage,
        galleryUrls: travel.gallery,
        programJson: JSON.stringify(travel.program),
        inclusionsJson: JSON.stringify(travel.included),
        exclusionsJson: JSON.stringify(travel.excluded),
        theme: travel.theme,
        experienceTags: travel.uniquePoints.slice(0, 3),
        isFeatured: i < 3, // Top 3 featured
        isCoupDeCoeur: i === 0 || i === 1, // Marrakech + Santorin
        latitude: travel.lat,
        longitude: travel.lng,
        uniquePoints: travel.uniquePoints,
        creatorMessage: travel.creatorMessage,
        travelStatus: 'BOOKABLE',
        publishedAt: new Date(),
        salesOpenAt: new Date(),
        minPaxToGo: Math.ceil(travel.capacity * 0.6),
      },
    });

    // 4. Create 3 TravelOccurrences (prochains mois)
    for (let occ = 0; occ < 3; occ++) {
      const occDeparture = new Date();
      occDeparture.setMonth(occDeparture.getMonth() + 1 + occ);

      const occReturn = new Date(occDeparture);
      occReturn.setDate(occReturn.getDate() + travel.duration - 1);

      await prisma.travelOccurrence.upsert({
        where: {
          travelId_occurrenceNumber: {
            travelId: createdTravel.id,
            occurrenceNumber: occ + 1,
          },
        },
        update: {},
        create: {
          travelId: createdTravel.id,
          departureDateActual: occDeparture,
          returnDateActual: occReturn,
          occurrenceNumber: occ + 1,
        },
      });
    }

    console.log(`    ✅ ${travel.title} — ${travel.price}€ · ${travel.capacity} places · 3 occurrences`);
  }

  console.log('\n🎉 Seed terminé — 10 voyages + 10 créateurs + 30 occurrences créés.');
}

// ════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════

seedTravels()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Erreur seed:', e);
    prisma.$disconnect();
    process.exit(1);
  });
