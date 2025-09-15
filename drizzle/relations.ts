import { relations } from "drizzle-orm/relations";
import { users, admModuleAcces, admStatutUser, bipListing, eapEntrainement, eapTheme, eapPresence, eapPresenceSoir, eapEpreuves, eapResultat, forPresenceGarde, forManoeuvreGarde, forPresencePonctuelle, forManoeuvrePonctuelle, habZone, habReserve, habTaillePredefinie, habUtilisateurs, icrInventaire, icrDepart, icrZoneInventaire, icrItemZone, icrRetour, mcoBlesse, mcoInterventions, mcoInterventionsVehicules, mcoCategorie, mcoMotifs, netLocaux, netDemandeReparation, netHistorique, netNettoyage, phaLots, phaItems, phaEmplacement, remVehicule, remCarrosserie, remCarte, remDemandeReparation, remDocumentBord, remEcheance, remZoneInventaireComplet, remElementInventaireComplet, remHistoriqueCarteCarburant, remInventaireHebdomadaire, remVerificationJournaliere, userEntree } from "./schema";

export const admModuleAccesRelations = relations(admModuleAcces, ({one}) => ({
	user: one(users, {
		fields: [admModuleAcces.idUtilisateur],
		references: [users.refUsers]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	admModuleAcces: many(admModuleAcces),
	admStatutUsers: many(admStatutUser),
	bipListings: many(bipListing),
	eapEntrainements: many(eapEntrainement),
	eapResultats: many(eapResultat),
	forPresenceGardes: many(forPresenceGarde),
	forPresencePonctuelles: many(forPresencePonctuelle),
	habUtilisateurs: many(habUtilisateurs),
	mcoBlesses: many(mcoBlesse),
	remHistoriqueCarteCarburants: many(remHistoriqueCarteCarburant),
	userEntrees: many(userEntree),
}));

export const admStatutUserRelations = relations(admStatutUser, ({one}) => ({
	user: one(users, {
		fields: [admStatutUser.refUser],
		references: [users.refUsers]
	}),
}));

export const bipListingRelations = relations(bipListing, ({one}) => ({
	user: one(users, {
		fields: [bipListing.idUser],
		references: [users.refUsers]
	}),
}));

export const eapEntrainementRelations = relations(eapEntrainement, ({one}) => ({
	user: one(users, {
		fields: [eapEntrainement.idEncadrant],
		references: [users.refUsers]
	}),
}));

export const eapPresenceRelations = relations(eapPresence, ({one}) => ({
	eapTheme: one(eapTheme, {
		fields: [eapPresence.themeSeance],
		references: [eapTheme.idTheme]
	}),
}));

export const eapThemeRelations = relations(eapTheme, ({many}) => ({
	eapPresences: many(eapPresence),
	eapPresenceSoirs: many(eapPresenceSoir),
}));

export const eapPresenceSoirRelations = relations(eapPresenceSoir, ({one}) => ({
	eapTheme: one(eapTheme, {
		fields: [eapPresenceSoir.themeSeance],
		references: [eapTheme.idTheme]
	}),
}));

export const eapResultatRelations = relations(eapResultat, ({one}) => ({
	eapEpreuve: one(eapEpreuves, {
		fields: [eapResultat.idEpreuve],
		references: [eapEpreuves.idEpreuve]
	}),
	user: one(users, {
		fields: [eapResultat.idUtilisateur],
		references: [users.refUsers]
	}),
}));

export const eapEpreuvesRelations = relations(eapEpreuves, ({many}) => ({
	eapResultats: many(eapResultat),
}));

export const forPresenceGardeRelations = relations(forPresenceGarde, ({one}) => ({
	user: one(users, {
		fields: [forPresenceGarde.idUtilisateur],
		references: [users.refUsers]
	}),
	forManoeuvreGarde: one(forManoeuvreGarde, {
		fields: [forPresenceGarde.idManoeuvre],
		references: [forManoeuvreGarde.idManoeuvre]
	}),
}));

export const forManoeuvreGardeRelations = relations(forManoeuvreGarde, ({many}) => ({
	forPresenceGardes: many(forPresenceGarde),
}));

export const forPresencePonctuelleRelations = relations(forPresencePonctuelle, ({one}) => ({
	user: one(users, {
		fields: [forPresencePonctuelle.idUtilisateur],
		references: [users.refUsers]
	}),
	forManoeuvrePonctuelle: one(forManoeuvrePonctuelle, {
		fields: [forPresencePonctuelle.idManoeuvre],
		references: [forManoeuvrePonctuelle.idManoeuvre]
	}),
}));

export const forManoeuvrePonctuelleRelations = relations(forManoeuvrePonctuelle, ({many}) => ({
	forPresencePonctuelles: many(forPresencePonctuelle),
}));

export const habReserveRelations = relations(habReserve, ({one}) => ({
	habZone: one(habZone, {
		fields: [habReserve.idZone],
		references: [habZone.idZone]
	}),
	habTaillePredefinie: one(habTaillePredefinie, {
		fields: [habReserve.idEquipement],
		references: [habTaillePredefinie.idTaillePredefinie]
	}),
}));

export const habZoneRelations = relations(habZone, ({many}) => ({
	habReserves: many(habReserve),
}));

export const habTaillePredefinieRelations = relations(habTaillePredefinie, ({many}) => ({
	habReserves: many(habReserve),
	habUtilisateurs: many(habUtilisateurs),
}));

export const habUtilisateursRelations = relations(habUtilisateurs, ({one}) => ({
	habTaillePredefinie: one(habTaillePredefinie, {
		fields: [habUtilisateurs.idEquipement],
		references: [habTaillePredefinie.idTaillePredefinie]
	}),
	user: one(users, {
		fields: [habUtilisateurs.refUsers],
		references: [users.refUsers]
	}),
}));

export const icrDepartRelations = relations(icrDepart, ({one, many}) => ({
	icrInventaire: one(icrInventaire, {
		fields: [icrDepart.idInventaire],
		references: [icrInventaire.idInventaire]
	}),
	icrRetours: many(icrRetour),
}));

export const icrInventaireRelations = relations(icrInventaire, ({many}) => ({
	icrDeparts: many(icrDepart),
	icrRetours: many(icrRetour),
	icrZoneInventaires: many(icrZoneInventaire),
}));

export const icrItemZoneRelations = relations(icrItemZone, ({one}) => ({
	icrZoneInventaire: one(icrZoneInventaire, {
		fields: [icrItemZone.idZoneInventaire],
		references: [icrZoneInventaire.idZoneInventaire]
	}),
}));

export const icrZoneInventaireRelations = relations(icrZoneInventaire, ({one, many}) => ({
	icrItemZones: many(icrItemZone),
	icrInventaire: one(icrInventaire, {
		fields: [icrZoneInventaire.idInventaire],
		references: [icrInventaire.idInventaire]
	}),
}));

export const icrRetourRelations = relations(icrRetour, ({one}) => ({
	icrDepart: one(icrDepart, {
		fields: [icrRetour.idDepart],
		references: [icrDepart.idDepart]
	}),
	icrInventaire: one(icrInventaire, {
		fields: [icrRetour.idInventaire],
		references: [icrInventaire.idInventaire]
	}),
}));

export const mcoBlesseRelations = relations(mcoBlesse, ({one}) => ({
	user: one(users, {
		fields: [mcoBlesse.refUser],
		references: [users.refUsers]
	}),
}));

export const mcoInterventionsVehiculesRelations = relations(mcoInterventionsVehicules, ({one}) => ({
	mcoIntervention: one(mcoInterventions, {
		fields: [mcoInterventionsVehicules.idIntervention],
		references: [mcoInterventions.idIntervention]
	}),
}));

export const mcoInterventionsRelations = relations(mcoInterventions, ({many}) => ({
	mcoInterventionsVehicules: many(mcoInterventionsVehicules),
}));

export const mcoMotifsRelations = relations(mcoMotifs, ({one}) => ({
	mcoCategorie: one(mcoCategorie, {
		fields: [mcoMotifs.categorie],
		references: [mcoCategorie.categorie]
	}),
}));

export const mcoCategorieRelations = relations(mcoCategorie, ({many}) => ({
	mcoMotifs: many(mcoMotifs),
}));

export const netDemandeReparationRelations = relations(netDemandeReparation, ({one}) => ({
	netLocaux: one(netLocaux, {
		fields: [netDemandeReparation.idLocaux],
		references: [netLocaux.idLocal]
	}),
}));

export const netLocauxRelations = relations(netLocaux, ({many}) => ({
	netDemandeReparations: many(netDemandeReparation),
	netHistoriques: many(netHistorique),
	netNettoyages: many(netNettoyage),
}));

export const netHistoriqueRelations = relations(netHistorique, ({one}) => ({
	netLocaux: one(netLocaux, {
		fields: [netHistorique.idLocal],
		references: [netLocaux.idLocal]
	}),
}));

export const netNettoyageRelations = relations(netNettoyage, ({one}) => ({
	netLocaux: one(netLocaux, {
		fields: [netNettoyage.idLocal],
		references: [netLocaux.idLocal]
	}),
}));

export const phaItemsRelations = relations(phaItems, ({one}) => ({
	phaLot: one(phaLots, {
		fields: [phaItems.lotItem],
		references: [phaLots.idLot]
	}),
}));

export const phaLotsRelations = relations(phaLots, ({one, many}) => ({
	phaItems: many(phaItems),
	phaEmplacement: one(phaEmplacement, {
		fields: [phaLots.emplacementLot],
		references: [phaEmplacement.idEmplacement]
	}),
}));

export const phaEmplacementRelations = relations(phaEmplacement, ({many}) => ({
	phaLots: many(phaLots),
}));

export const remCarrosserieRelations = relations(remCarrosserie, ({one}) => ({
	remVehicule: one(remVehicule, {
		fields: [remCarrosserie.idVehicule],
		references: [remVehicule.idVehicule]
	}),
}));

export const remVehiculeRelations = relations(remVehicule, ({many}) => ({
	remCarrosseries: many(remCarrosserie),
	remCartes: many(remCarte),
	remDemandeReparations: many(remDemandeReparation),
	remDocumentBords: many(remDocumentBord),
	remEcheances: many(remEcheance),
	remInventaireHebdomadaires: many(remInventaireHebdomadaire),
	remVerificationJournalieres_idVehicule: many(remVerificationJournaliere, {
		relationName: "remVerificationJournaliere_idVehicule_remVehicule_idVehicule"
	}),
	remVerificationJournalieres_idVehicule: many(remVerificationJournaliere, {
		relationName: "remVerificationJournaliere_idVehicule_remVehicule_idVehicule"
	}),
	remZoneInventaireComplets: many(remZoneInventaireComplet),
}));

export const remCarteRelations = relations(remCarte, ({one, many}) => ({
	remVehicule: one(remVehicule, {
		fields: [remCarte.idVehicule],
		references: [remVehicule.idVehicule]
	}),
	remHistoriqueCarteCarburants: many(remHistoriqueCarteCarburant),
}));

export const remDemandeReparationRelations = relations(remDemandeReparation, ({one}) => ({
	remVehicule: one(remVehicule, {
		fields: [remDemandeReparation.idVehicule],
		references: [remVehicule.idVehicule]
	}),
}));

export const remDocumentBordRelations = relations(remDocumentBord, ({one}) => ({
	remVehicule: one(remVehicule, {
		fields: [remDocumentBord.idVehicule],
		references: [remVehicule.idVehicule]
	}),
}));

export const remEcheanceRelations = relations(remEcheance, ({one}) => ({
	remVehicule: one(remVehicule, {
		fields: [remEcheance.vehiculeEcheance],
		references: [remVehicule.idVehicule]
	}),
}));

export const remElementInventaireCompletRelations = relations(remElementInventaireComplet, ({one}) => ({
	remZoneInventaireComplet: one(remZoneInventaireComplet, {
		fields: [remElementInventaireComplet.idZone],
		references: [remZoneInventaireComplet.idZone]
	}),
}));

export const remZoneInventaireCompletRelations = relations(remZoneInventaireComplet, ({one, many}) => ({
	remElementInventaireComplets: many(remElementInventaireComplet),
	remVehicule: one(remVehicule, {
		fields: [remZoneInventaireComplet.idVehicule],
		references: [remVehicule.idVehicule]
	}),
}));

export const remHistoriqueCarteCarburantRelations = relations(remHistoriqueCarteCarburant, ({one}) => ({
	remCarte: one(remCarte, {
		fields: [remHistoriqueCarteCarburant.idCarte],
		references: [remCarte.idCarte]
	}),
	user: one(users, {
		fields: [remHistoriqueCarteCarburant.idUtilisateur],
		references: [users.refUsers]
	}),
}));

export const remInventaireHebdomadaireRelations = relations(remInventaireHebdomadaire, ({one}) => ({
	remVehicule: one(remVehicule, {
		fields: [remInventaireHebdomadaire.idVehicule],
		references: [remVehicule.idVehicule]
	}),
}));

export const remVerificationJournaliereRelations = relations(remVerificationJournaliere, ({one}) => ({
	remVehicule_idVehicule: one(remVehicule, {
		fields: [remVerificationJournaliere.idVehicule],
		references: [remVehicule.idVehicule],
		relationName: "remVerificationJournaliere_idVehicule_remVehicule_idVehicule"
	}),
	remVehicule_idVehicule: one(remVehicule, {
		fields: [remVerificationJournaliere.idVehicule],
		references: [remVehicule.idVehicule],
		relationName: "remVerificationJournaliere_idVehicule_remVehicule_idVehicule"
	}),
}));

export const userEntreeRelations = relations(userEntree, ({one}) => ({
	user: one(users, {
		fields: [userEntree.refUser],
		references: [users.refUsers]
	}),
}));