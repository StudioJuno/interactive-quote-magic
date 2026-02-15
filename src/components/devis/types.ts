export interface QuoteData {
  // Step 1 - Offre
  offerType: "film" | "photos" | "photos-film" | "";
  coverageType: "jour-j" | "autres-moments" | "";

  // Step 2 - Prestation
  lieu: string;
  departement: string;
  nbInvites: string;
  nbPhotographes: number;
  nbVideastes: number;

  // Options supplémentaires
  optionDrone: boolean;
  optionInterviews: boolean;

  // Films
  filmTeaser: boolean;
  filmSignature: boolean;
  filmReseaux: boolean;
  filmBetisier: boolean;

  // Supports
  albumPhoto: boolean;
  coffretUSB: boolean;

  // Délai
  delai: "standard" | "express" | "";

  // Step 3 - Remarque
  remarques: string;

  // Step 4 - Contact
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateMariage: string;
}

export const initialQuoteData: QuoteData = {
  offerType: "",
  coverageType: "",
  lieu: "",
  departement: "75",
  nbInvites: "",
  nbPhotographes: 0,
  nbVideastes: 0,
  optionDrone: false,
  optionInterviews: false,
  filmTeaser: false,
  filmSignature: false,
  filmReseaux: false,
  filmBetisier: false,
  albumPhoto: false,
  coffretUSB: false,
  delai: "",
  remarques: "",
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  dateMariage: "",
};

export const PRICES = {
  photographe: 1260,
  vidéaste: 1700,
  drone: 150,
  interviews: 100,
  teaser: 200,
  signature: 250,
  reseaux: 200,
  betisier: 80,
  album: 200,
  coffret: 80,
  express: 200,
};
