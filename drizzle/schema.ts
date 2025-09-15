import {
    mysqlTable,
    int,
    varchar,
    date,
    longtext,
    datetime,
    index,
    time,
    mysqlView,
    tinyint
} from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const admDemandeAcces = mysqlTable("adm-demande-acces", {
	idDemande: int().autoincrement().notNull(),
	nomDemande: varchar({ length: 500 }).notNull(),
	prenomDemande: varchar({ length: 500 }).notNull(),
	mailDemande: varchar({ length: 500 }).notNull(),
	mdpDemande: varchar({ length: 500 }).notNull(),
	refUsers: int().notNull(),
	matriculeUser: varchar({ length: 500 }).notNull(),
});

export const admExtraGarde = mysqlTable("adm-extra-garde", {
	idExtra: int().autoincrement().notNull(),
	idUser: int().notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateDebut: date({ mode: 'string' }).notNull(),
	horaireDebut: varchar({ length: 500 }).notNull(),
	horaireFin: varchar({ length: 500 }).notNull(),
	typeHoraire: varchar({ length: 500 }).notNull(),
});

export const admListeDiffusion = mysqlTable("adm-liste-diffusion", {
	idListe: int().autoincrement().notNull(),
	nomListe: varchar({ length: 500 }).notNull(),
	detailsListe: longtext().notNull(),
});

export const admLogCarte = mysqlTable("adm-log-carte", {
	idLog: int().autoincrement().notNull(),
	identiteAgent: varchar({ length: 500 }).notNull(),
	identiteVehicule: varchar({ length: 500 }).notNull(),
	dateHeureConnexion: datetime({ mode: 'string'}).notNull(),
	typeLog: varchar({ length: 500 }).notNull(),
});

export const admModuleAcces = mysqlTable("adm-module-acces", {
	idModule: varchar({ length: 3 }).notNull(),
	idUtilisateur: int().notNull().references(() => users.refUsers, { onDelete: "cascade", onUpdate: "cascade" } ),
	superAdminModule: int().notNull(),
	ordreModule: int().notNull(),
},
(table) => [
	index("idUtilisateur").on(table.idUtilisateur),
]);

export const admStatutRapide = mysqlTable("adm-statut-rapide", {
	idStatut: int().autoincrement().notNull(),
	libelleStatut: varchar({ length: 500 }).notNull(),
	listeAdmin: longtext().notNull(),
	listeUtilisateur: longtext().notNull(),
});

export const admStatutUser = mysqlTable("adm-statut-user", {
	refUser: int().notNull().references(() => users.refUsers, { onDelete: "cascade", onUpdate: "cascade" } ),
	statutUser: varchar({ length: 500 }).default('\'SPV\'').notNull(),
	matriculeUser: varchar({ length: 500 }).notNull(),
});

export const ariBouteille = mysqlTable("ari-bouteille", {
	idBouteille: varchar({ length: 500 }).notNull(),
	idZone: int().default(1).notNull(),
});

export const ariDossard = mysqlTable("ari-dossard", {
	idDossard: varchar({ length: 500 }).notNull(),
	idZone: int().default(1).notNull(),
});

export const ariMouvementHistorique = mysqlTable("ari-mouvement-historique", {
	idMouvement: int().autoincrement().notNull(),
	identiteObjet: varchar({ length: 500 }).notNull(),
	nomOldZone: varchar({ length: 500 }).notNull(),
	nomNewZone: varchar({ length: 500 }).notNull(),
	identiteUser: varchar({ length: 500 }).notNull(),
	dateHeure: varchar({ length: 500 }).notNull(),
	typeObjet: varchar({ length: 500 }).notNull(),
});

export const ariZone = mysqlTable("ari-zone", {
	idZone: int().autoincrement().notNull(),
	libelleZone: varchar({ length: 500 }).notNull(),
});

export const bipListing = mysqlTable("bip-listing", {
	idUser: int().notNull().references(() => users.refUsers, { onDelete: "cascade", onUpdate: "cascade" } ),
	numeroBip: varchar({ length: 500 }).notNull(),
	numeroBadge: varchar({ length: 500 }).notNull(),
});

export const bipReserve = mysqlTable("bip-reserve", {
	numeroBip: varchar({ length: 500 }).notNull(),
});

export const ccoConsignes = mysqlTable("cco-consignes", {
	idConsigne: int().autoincrement().notNull(),
	typeConsigne: varchar({ length: 500 }).notNull(),
	dateDebutConsigne: varchar({ length: 500 }).notNull(),
	dateFinConsigne: varchar({ length: 500 }).default('NULL'),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateDebutBetween: date({ mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateFinBetween: date({ mode: 'string' }).notNull(),
	heureDebutConsigne: varchar({ length: 500 }).default('NULL'),
	heureFinConsigne: varchar({ length: 500 }).default('NULL'),
	journeeConsigne: tinyint().notNull(),
	recurenceConsigne: varchar({ length: 500 }).notNull(),
	libelleConsigne: varchar({ length: 500 }).notNull(),
	detailConsigne: longtext().default('NULL'),
	fichierConsigne: varchar({ length: 500 }).default('NULL'),
	urlConsigne: varchar({ length: 500 }).default('NULL'),
	dateClotureConsgine: varchar({ length: 500 }).default('NULL'),
	utilisateurClotureConsigne: varchar({ length: 500 }).default('NULL'),
	utilisateurCreationConsigne: varchar({ length: 500 }).notNull(),
	idVehicule: varchar({ length: 500 }).default('NULL'),
});

export const ccoReservationSalle = mysqlTable("cco-reservation-salle", {
	idReservation: int().autoincrement().notNull(),
	salleReservation: varchar({ length: 500 }).notNull(),
	motifReservation: varchar("MotifReservation", { length: 500 }).notNull(),
	requerentReservation: varchar({ length: 500 }).notNull(),
	dateHeureDebut: varchar({ length: 500 }).notNull(),
	dateHeureFin: varchar({ length: 500 }).notNull(),
});

export const ccoReservations = mysqlTable("cco-reservations", {
	idReservation: int().autoincrement().notNull(),
	vehiculeReservation: varchar({ length: 500 }).notNull(),
	requerentReservation: varchar({ length: 500 }).notNull(),
	dateHeureDebut: varchar({ length: 500 }).notNull(),
	dateHeureFin: varchar({ length: 500 }).notNull(),
	motifReservation: varchar("MotifReservation", { length: 500 }).notNull(),
	lieuReservation: varchar("LieuReservation", { length: 500 }).notNull(),
});

export const ccoSalle = mysqlTable("cco-salle", {
	salleReservation: varchar({ length: 500 }).notNull(),
});

export const dsbNote = mysqlTable("dsb-note", {
	idNote: int().autoincrement().notNull(),
	corpsNote: longtext().notNull(),
	idUser: varchar({ length: 500 }).notNull(),
});

export const eapEntrainement = mysqlTable("eap-entrainement", {
	idEntrainement: int().autoincrement().notNull(),
	libelleEntrainement: varchar({ length: 500 }).notNull(),
	detailsEntrainement: varchar({ length: 1000 }).notNull(),
	dateDebutEntrainement: varchar({ length: 500 }).notNull(),
	dateFinEntrainement: varchar({ length: 500 }).notNull(),
	idEncadrant: int().default(0).references(() => users.refUsers, { onDelete: "set null", onUpdate: "cascade" } ),
	couleurEntrainement: varchar({ length: 500 }).notNull(),
	lieuEntrainement: varchar({ length: 500 }).notNull(),
	encadrantExterne: varchar({ length: 500 }).default('NULL'),
	bnssa: int().notNull(),
	urlEntrainement: longtext().notNull(),
});

export const eapEpreuves = mysqlTable("eap-epreuves", {
	idEpreuve: int().autoincrement().notNull(),
	libelleEpreuve: varchar({ length: 500 }).notNull(),
	emplacementEpreuve: int().notNull(),
});

export const eapLieux = mysqlTable("eap-lieux", {
	idLieu: int().autoincrement().notNull(),
	nomLieu: varchar({ length: 500 }).notNull(),
	positionLieu: int().notNull(),
});

export const eapPresence = mysqlTable("eap-presence", {
	themeSeance: int().notNull().references(() => eapTheme.idTheme, { onDelete: "cascade", onUpdate: "cascade" } ),
	idUtilisateur: int().notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateSeance: date({ mode: 'string' }).notNull(),
	dureePresence: varchar({ length: 500 }).notNull(),
	detailsAbs: varchar({ length: 500 }).default('\'TD11FYMTCrcJ19ZiYMkrfw==\'').notNull(),
});

export const eapPresenceSoir = mysqlTable("eap-presence-soir", {
	themeSeance: int().notNull().references(() => eapTheme.idTheme, { onDelete: "cascade", onUpdate: "cascade" } ),
	idUtilisateur: int().notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateSeance: date({ mode: 'string' }).notNull(),
	dureePresence: varchar({ length: 500 }).notNull(),
},
(table) => [
	index("themeSeance").on(table.themeSeance),
]);

export const eapResultat = mysqlTable("eap-resultat", {
	idUtilisateur: int().autoincrement().notNull().references(() => users.refUsers, { onDelete: "cascade", onUpdate: "cascade" } ),
	idEpreuve: int().notNull().references(() => eapEpreuves.idEpreuve, { onDelete: "cascade", onUpdate: "cascade" } ),
	resultatEpreuve: varchar({ length: 500 }).notNull(),
	anneeEpreuve: int().notNull(),
},
(table) => [
	index("idEpreuve").on(table.idEpreuve),
]);

export const eapTheme = mysqlTable("eap-theme", {
	idTheme: int().autoincrement().notNull(),
	libelleTheme: varchar({ length: 500 }).notNull(),
	emplacementTheme: int().notNull(),
});

export const forManoeuvreGarde = mysqlTable("for-manoeuvre-garde", {
	idManoeuvre: int().autoincrement().notNull(),
	libelleManoeuvre: varchar({ length: 500 }).notNull(),
	themeManoeuvre: varchar({ length: 500 }).notNull(),
	dateManoeuvre: datetime({ mode: 'string'}).notNull(),
	dureeManoeuvre: varchar({ length: 500 }).notNull(),
	lienManoeuvre: longtext().notNull(),
	sousThemeManoeuvre: varchar({ length: 500 }).notNull(),
});

export const forManoeuvrePonctuelle = mysqlTable("for-manoeuvre-ponctuelle", {
	idManoeuvre: int().autoincrement().notNull(),
	libelleManoeuvre: varchar({ length: 500 }).notNull(),
	themeManoeuvre: varchar({ length: 500 }).notNull(),
	dateManoeuvre: datetime({ mode: 'string'}).notNull(),
	dureeManoeuvre: varchar({ length: 500 }).notNull(),
	nbStagiaireManoeuvre: int().notNull(),
	nbFormateurManoeuvre: int().notNull(),
	lienManoeuvrePonctuelle: longtext().notNull(),
	sousThemeManoeuvre: varchar({ length: 500 }).notNull(),
});

export const forPresenceGarde = mysqlTable("for-presence-garde", {
	idManoeuvre: int().notNull().references(() => forManoeuvreGarde.idManoeuvre, { onDelete: "cascade", onUpdate: "cascade" } ),
	idUtilisateur: int().notNull().references(() => users.refUsers, { onDelete: "cascade", onUpdate: "cascade" } ),
	presenceManoeuvre: int().notNull(),
	statutManoeuvre: varchar({ length: 500 }).notNull(),
	statutInscription: int().notNull(),
	dureePresence: varchar({ length: 500 }).notNull(),
	detailsAbsence: varchar({ length: 500 }).notNull(),
},
(table) => [
	index("idUtilisateur").on(table.idUtilisateur),
]);

export const forPresencePonctuelle = mysqlTable("for-presence-ponctuelle", {
	idManoeuvre: int().notNull().references(() => forManoeuvrePonctuelle.idManoeuvre, { onDelete: "cascade", onUpdate: "cascade" } ),
	idUtilisateur: int().notNull().references(() => users.refUsers, { onDelete: "cascade", onUpdate: "cascade" } ),
	presenceManoeuvre: int().default(0).notNull(),
	statutManoeuvre: varchar({ length: 500 }).notNull(),
	statutInscription: int().notNull(),
	dureePresence: varchar({ length: 500 }).notNull(),
	detailsAbsence: varchar({ length: 500 }).notNull(),
},
(table) => [
	index("idUtilisateur").on(table.idUtilisateur),
]);

export const habDemandeReparation = mysqlTable("hab-demande-reparation", {
	idReparation: int().autoincrement().notNull(),
	idVetement: varchar({ length: 500 }).notNull(),
	dateReparation: varchar({ length: 500 }).notNull(),
	statutVetement: varchar({ length: 500 }).notNull(),
	detailReparation: varchar({ length: 500 }).notNull(),
	numeroReparation: varchar({ length: 500 }).notNull(),
	createurReparation: varchar({ length: 500 }).notNull(),
	clotureReparation: varchar({ length: 500 }).default('NULL'),
	fermetureReparation: varchar({ length: 500 }).default('NULL'),
	statutDemande: varchar({ length: 500 }).default('\'enkU5SjTkWex3kel+CW/Gw==\'').notNull(),
	identiteReceveur: longtext().default('NULL'),
	categorieDemande: varchar({ length: 500 }).notNull(),
	observation: longtext().notNull(),
});

export const habReserve = mysqlTable("hab-reserve", {
	idHabReserve: int().autoincrement().notNull(),
	idVetement: varchar({ length: 500 }).notNull(),
	idZone: int().notNull().references(() => habZone.idZone, { onUpdate: "cascade" } ),
	idEquipement: int().notNull().references(() => habTaillePredefinie.idTaillePredefinie, { onDelete: "cascade", onUpdate: "cascade" } ),
	tailleVetement: varchar({ length: 500 }).notNull(),
},
(table) => [
	index("idZone").on(table.idZone),
	index("idEquipement").on(table.idEquipement),
]);

export const habTaillePredefinie = mysqlTable("hab-taille-predefinie", {
	idTaillePredefinie: int().autoincrement().notNull(),
	libelleTaillePredefinie: varchar({ length: 500 }).notNull(),
	listeTaillePredefinie: varchar({ length: 1000 }).notNull(),
});

export const habUtilisateurs = mysqlTable("hab-utilisateurs", {
	idHabUtilisateur: int().autoincrement().notNull(),
	idEquipement: int().notNull().references(() => habTaillePredefinie.idTaillePredefinie, { onDelete: "cascade", onUpdate: "cascade" } ),
	refUsers: int().notNull().references(() => users.refUsers, { onDelete: "cascade", onUpdate: "cascade" } ),
	tailleUtilisateur: varchar({ length: 500 }).notNull(),
	refUtilisateur: varchar({ length: 500 }).notNull(),
	dateUpdateElement: varchar({ length: 500 }).notNull(),
},
(table) => [
	index("idEquipement").on(table.idEquipement),
	index("refUsers").on(table.refUsers),
]);

export const habZone = mysqlTable("hab-zone", {
	idZone: int().autoincrement().notNull(),
	libelleZone: varchar({ length: 500 }).notNull(),
});

export const icrDepart = mysqlTable("icr-depart", {
	idDepart: int().autoincrement().notNull(),
	idInventaire: int().notNull().references(() => icrInventaire.idInventaire, { onDelete: "cascade", onUpdate: "cascade" } ),
	nomOperateur: varchar({ length: 500 }).notNull(),
	prenomOperateur: varchar({ length: 500 }).notNull(),
	dateDepart: varchar({ length: 500 }).notNull(),
	listeItemManquant: longtext().notNull(),
	listeItemAnomalie: longtext().notNull(),
	commentaireDepart: varchar({ length: 500 }).notNull(),
},
(table) => [
	index("idInventaire").on(table.idInventaire),
]);

export const icrInventaire = mysqlTable("icr-inventaire", {
	idInventaire: int().autoincrement().notNull(),
	libelleInventaire: varchar({ length: 500 }).notNull(),
});

export const icrItemZone = mysqlTable("icr-item-zone", {
	idItemZone: int().autoincrement().notNull(),
	libelleItemZone: varchar({ length: 500 }).notNull(),
	imagineItemZone: varchar({ length: 500 }).notNull(),
	messageItemZone: varchar({ length: 500 }).notNull(),
	emplacementItemZone: int().notNull(),
	idZoneInventaire: int().notNull().references(() => icrZoneInventaire.idZoneInventaire, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => [
	index("idZoneInventaire").on(table.idZoneInventaire),
]);

export const icrRetour = mysqlTable("icr-retour", {
	idRetour: int().autoincrement().notNull(),
	idInventaire: int().notNull().references(() => icrInventaire.idInventaire, { onDelete: "cascade", onUpdate: "cascade" } ),
	nomOperateur: varchar({ length: 500 }).notNull(),
	prenomOperateur: varchar({ length: 500 }).notNull(),
	dateRetour: varchar({ length: 500 }).notNull(),
	listeItemManquant: longtext().notNull(),
	listeItemAnomalie: longtext().notNull(),
	commentaireRetour: varchar({ length: 500 }).notNull(),
	idDepart: int().notNull().references(() => icrDepart.idDepart, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => [
	index("idDepart").on(table.idDepart),
	index("idInventaire").on(table.idInventaire),
]);

export const icrZoneInventaire = mysqlTable("icr-zone-inventaire", {
	idZoneInventaire: int().autoincrement().notNull(),
	libelleZoneInventaire: varchar({ length: 500 }).notNull(),
	emplacementZoneInventaire: int().notNull(),
	idInventaire: int().notNull().references(() => icrInventaire.idInventaire, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => [
	index("idInventaire").on(table.idInventaire),
]);

export const logEmplacement = mysqlTable("log-emplacement", {
	idEmplacement: int().autoincrement().notNull(),
	libelleEmplacement: varchar({ length: 500 }).notNull(),
});

export const mcoAbsent = mysqlTable("mco-absent", {
	idAbsent: int().autoincrement().notNull(),
	idUser: int().notNull(),
	dateDebut: datetime({ mode: 'string'}).notNull(),
	dateFin: datetime({ mode: 'string'}).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateGarde: date({ mode: 'string' }).notNull(),
	description: longtext().notNull(),
});

export const mcoBlesse = mysqlTable("mco-blesse", {
	idBlesse: int().autoincrement().notNull(),
	dateBlesse: varchar({ length: 500 }).notNull(),
	refUser: int().notNull().references(() => users.refUsers, { onDelete: "cascade", onUpdate: "cascade" } ),
	dateNaissanceBlesse: varchar({ length: 500 }).notNull(),
	etatBlesse: longtext().notNull(),
	circonstanceBlesse: longtext().notNull(),
	hospitalisationBlesse: varchar({ length: 500 }).notNull(),
	vehiculeHospitalisationBlesse: varchar({ length: 1000 }).default('NULL'),
	temoinBlesse: varchar({ length: 1000 }).notNull(),
	typeBlesse: varchar({ length: 500 }).notNull(),
	familleBlesse: varchar({ length: 500 }).notNull(),
	enfantBlesse: int().notNull(),
},
(table) => [
	index("refUser").on(table.refUser),
]);

export const mcoCategorie = mysqlTable("mco-categorie", {
	categorie: varchar({ length: 200 }).notNull(),
	favoris: int().default(0).notNull(),
});

export const mcoCis = mysqlTable("mco-cis", {
	cis: varchar({ length: 200 }).notNull(),
	favoris: int().default(0).notNull(),
});

export const mcoEquipe = mysqlTable("mco-equipe", {
	libelleEquipe: varchar({ length: 500 }).notNull(),
});

export const mcoFichierInterventionMultiple = mysqlTable("mco-fichier-intervention-multiple", {
	idFichier: int().autoincrement().notNull(),
	libelleFichier: varchar({ length: 500 }).notNull(),
	fileFichier: varchar({ length: 500 }).notNull(),
});

export const mcoIndisponibilite = mysqlTable("mco-indisponibilite", {
	idIndisponibilite: int().autoincrement().notNull(),
	vehiculeIndisponibilite: varchar({ length: 500 }).notNull(),
	dateDebutIndisponibilite: varchar({ length: 500 }).notNull(),
	dateFinIndisponibilite: varchar({ length: 500 }).default('NULL'),
	motifIndisponibilite: varchar({ length: 500 }).notNull(),
	observationIndisponibilite: varchar({ length: 1000 }).default('NULL'),
	createurIndisponibilite: varchar({ length: 500 }).notNull(),
	dateDebutDecode: datetime({ mode: 'string'}).notNull(),
	dateFinDecode: datetime({ mode: 'string'}).notNull(),
});

export const mcoIndisponibiliteMotif = mysqlTable("mco-indisponibilite-motif", {
	motifIndisponibilite: varchar({ length: 500 }).notNull(),
});

export const mcoInterventions = mysqlTable("mco-interventions", {
	idIntervention: int().autoincrement().notNull(),
	numIntervention: varchar({ length: 500 }).notNull(),
	heureDebutIntervention: varchar({ length: 500 }).notNull(),
	dateDebutIntervention: varchar({ length: 500 }).notNull(),
	heureFinIntervention: varchar({ length: 500 }).default('NULL'),
	dateFinIntervention: varchar({ length: 500 }).default('NULL'),
	dataDate: datetime({ mode: 'string'}).notNull(),
	villeIntervention: varchar({ length: 200 }).notNull(),
	statutIntervention: varchar({ length: 500 }).notNull(),
	cisIntervention: varchar({ length: 200 }).notNull(),
	categorieIntervention: varchar({ length: 200 }).notNull(),
	motifIntervention: varchar({ length: 200 }).notNull(),
	astreinteIntervention: varchar({ length: 500 }).notNull(),
	typeAstreinteIntervention: varchar({ length: 500 }).default('NULL'),
	observationIntervention: longtext().notNull(),
});

export const mcoInterventionsVehicules = mysqlTable("mco-interventions-vehicules", {
	idPrimaire: int().autoincrement().notNull(),
	idIntervention: int().notNull().references(() => mcoInterventions.idIntervention, { onDelete: "cascade", onUpdate: "cascade" } ),
	idVehicule: varchar({ length: 200 }).notNull(),
	caVehicule: varchar({ length: 500 }).default('NULL'),
	condVehicule: varchar({ length: 500 }).default('NULL'),
	e1Vehicule: varchar({ length: 500 }).default('NULL'),
	e2Vehicule: varchar({ length: 500 }).default('NULL'),
	cbatVehicule: varchar({ length: 500 }).default('NULL'),
	ebatVehicule: varchar({ length: 500 }).default('NULL'),
	cbalVehicule: varchar({ length: 500 }).default('NULL'),
	ebalVehicule: varchar({ length: 500 }).default('NULL'),
},
(table) => [
	index("idIntervention").on(table.idIntervention),
]);

export const mcoMotifs = mysqlTable("mco-motifs", {
	motif: varchar({ length: 200 }).notNull(),
	categorie: varchar({ length: 200 }).notNull().references(() => mcoCategorie.categorie, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => [
	index("categorie").on(table.categorie),
]);

export const mcoMouvements = mysqlTable("mco-mouvements", {
	idMouvement: int().autoincrement().notNull(),
	idVehiculeMouvement: varchar({ length: 500 }).notNull(),
	nomRequerantVehicule: varchar({ length: 500 }).notNull(),
	motifMouvement: varchar({ length: 1000 }).notNull(),
	lieuMouvement: varchar({ length: 1000 }).notNull(),
	dateDebutMouvement: varchar({ length: 500 }).notNull(),
	dateFinMouvement: varchar({ length: 500 }).default('NULL'),
	dateDebutDecode: datetime({ mode: 'string'}).notNull(),
	dateFinDecode: datetime({ mode: 'string'}).notNull(),
});

export const mcoMouvementsMultiple = mysqlTable("mco-mouvements-multiple", {
	idMouvementMultiple: int().autoincrement().notNull(),
	vehiculeMouvementMultiple: longtext().notNull(),
	motifMouvementMultiple: varchar({ length: 500 }).notNull(),
	lieuMouvementMultiple: varchar({ length: 500 }).notNull(),
	dateDebutMouvementMultiple: varchar({ length: 500 }).notNull(),
	dateFinMouvementMultiple: varchar({ length: 500 }).default('NULL'),
});

export const mcoProcedures = mysqlTable("mco-procedures", {
	idProcedure: int().autoincrement().notNull(),
	libelleProcedure: varchar({ length: 500 }).notNull(),
	detailProcedure: longtext().notNull(),
});

export const mcoRapports = mysqlTable("mco-rapports", {
	idRapport: int().autoincrement().notNull(),
	dateRapport: varchar({ length: 500 }).notNull(),
	equipeRapport: varchar({ length: 500 }).notNull(),
	responsableGarde: varchar({ length: 500 }).notNull(),
	heureRapport: varchar({ length: 500 }).notNull(),
	commentaireRapport: longtext().notNull(),
});

export const mcoRegistre = mysqlTable("mco-registre", {
	idRegistre: int().autoincrement().notNull(),
	nomEntrant: varchar({ length: 500 }).notNull(),
	prenomEntrant: varchar({ length: 500 }).notNull(),
	nomEntreprise: varchar({ length: 500 }).notNull(),
	dateRegistre: varchar({ length: 500 }).notNull(),
	heureEntree: varchar({ length: 500 }).notNull(),
	heureSortie: varchar({ length: 500 }).default('NULL'),
	observationRegistre: longtext().default('NULL'),
	etatRegistre: varchar({ length: 500 }).default('NULL'),
});

export const mcoTypeDeclenchementAstreinte = mysqlTable("mco-type-declenchement-astreinte", {
	typeDeclenchement: varchar({ length: 500 }).notNull(),
});

export const mcoVehicule = mysqlTable("mco-vehicule", {
	vehicule: varchar({ length: 200 }).notNull(),
	piquet: varchar({ length: 500 }).notNull(),
	favoris: int().default(0).notNull(),
	ordreVehicule: int().default(0),
});

export const mcoVilles = mysqlTable("mco-villes", {
	villes: varchar({ length: 150 }).notNull(),
	favoris: int().default(0).notNull(),
});

export const modulesAcces = mysqlTable("modules_acces", {
	idModule: varchar({ length: 3 }).notNull(),
	idUtil: varchar({ length: 500 }).notNull(),
	superAdminModule: int().notNull(),
});

export const netConsigne = mysqlTable("net-consigne", {
	idConsigne: int().autoincrement().notNull(),
	libelleConsigne: varchar({ length: 500 }).notNull(),
	detailsConsigne: varchar({ length: 500 }).notNull(),
	dateDebutConsigne: varchar({ length: 500 }).notNull(),
	dateFinConsigne: varchar({ length: 500 }).notNull(),
	idUserConsigne: int().notNull(),
	affichageCco: int().notNull(),
	clotureCco: int().notNull(),
});

export const netDemandeReparation = mysqlTable("net-demande-reparation", {
	idReparation: int().autoincrement().notNull(),
	idLocaux: int().notNull().references(() => netLocaux.idLocal, { onDelete: "cascade", onUpdate: "cascade" } ),
	dateReparation: varchar({ length: 500 }).notNull(),
	detailReparation: varchar({ length: 500 }).notNull(),
	observationReparation: varchar({ length: 500 }).default('\'TD11FYMTCrcJ19ZiYMkrfw==\'').notNull(),
	numeroReparation: varchar({ length: 500 }).default('NULL'),
	createurReparation: varchar({ length: 500 }).notNull(),
	gestionDemande: varchar({ length: 500 }).notNull(),
	clotureReparation: varchar({ length: 500 }).default('NULL'),
	fermetureReparation: varchar({ length: 500 }).default('NULL'),
	statutDemande: varchar({ length: 500 }).default('NULL'),
	identiteReceveur: longtext().default('NULL'),
	categorieDemande: varchar({ length: 500 }).notNull(),
	observation: longtext().notNull(),
},
(table) => [
	index("idLocaux").on(table.idLocaux),
]);

export const netHistorique = mysqlTable("net-historique", {
	idHistorique: int().autoincrement().notNull(),
	listeAnomalie: longtext().notNull(),
	listeAnomalieFix: longtext().notNull(),
	listeAnomalieCaso: longtext().notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateHistorique: date({ mode: 'string' }).notNull(),
	idLocal: int().notNull().references(() => netLocaux.idLocal, { onDelete: "cascade", onUpdate: "cascade" } ),
	idUser: int().notNull(),
},
(table) => [
	index("idLocal").on(table.idLocal),
]);

export const netLocaux = mysqlTable("net-locaux", {
	idLocal: int().autoincrement().notNull(),
	libelleLocal: varchar({ length: 500 }).notNull(),
	emplacementLocal: int().notNull(),
});

export const netNettoyage = mysqlTable("net-nettoyage", {
	idNettoyage: int().autoincrement().notNull(),
	idLocal: int().notNull().references(() => netLocaux.idLocal, { onDelete: "cascade", onUpdate: "cascade" } ),
	dateHeureNettoyage: varchar({ length: 500 }).notNull(),
	commentaireNettoyage: longtext().notNull(),
	idUser: int().notNull(),
},
(table) => [
	index("idLocal").on(table.idLocal),
]);

export const newForGarde = mysqlTable("new-for-garde", {
	idFmpa: int().autoincrement().notNull(),
	libelleFmpa: varchar({ length: 500 }).notNull(),
	themeFmpa: varchar({ length: 500 }).notNull(),
	sousThemeFmpa: varchar({ length: 500 }).notNull(),
	dateFmpa: datetime({ mode: 'string'}).notNull(),
	dureeFmpa: time().notNull(),
	stagiaireFmpa: int().notNull(),
	formateurFmpa: int().notNull(),
	activite1Fmpa: varchar({ length: 500 }).notNull(),
	duree1Fmpa: time().notNull(),
	activite2Fmpa: varchar({ length: 500 }).default('NULL'),
	duree2Fmpa: time().default('NULL'),
	activite3Fmpa: varchar({ length: 500 }).default('NULL'),
	duree3Fmpa: time().default('NULL'),
	numeroFmpa: varchar({ length: 500 }).default('NULL'),
	signatureFmpa: int().default(0),
});

export const newForGardeInscription = mysqlTable("new-for-garde-inscription", {
	idFmpa: int().notNull(),
	idUtilisateur: int().notNull(),
	typeInscription: int().notNull(),
	presenceInscription: int().default(0).notNull(),
	dureePresenceInscription: time().default('NULL'),
	detailsAbscenceInscription: varchar({ length: 500 }).default('NULL'),
	historiqueInscription: longtext().default('NULL'),
});

export const newForPonctuelle = mysqlTable("new-for-ponctuelle", {
	idFmpa: int().autoincrement().notNull(),
	libelleFmpa: varchar({ length: 500 }).notNull(),
	themeFmpa: varchar({ length: 500 }).notNull(),
	sousThemeFmpa: varchar({ length: 500 }).notNull(),
	dateFmpa: datetime({ mode: 'string'}).notNull(),
	dureeFmpa: time().notNull(),
	stagiaireFmpa: int().notNull(),
	formateurFmpa: int().notNull(),
	activite1Fmpa: varchar({ length: 500 }).notNull(),
	duree1Fmpa: time().notNull(),
	activite2Fmpa: varchar({ length: 500 }).default('NULL'),
	duree2Fmpa: time().default('NULL'),
	activite3Fmpa: varchar({ length: 500 }).default('NULL'),
	duree3Fmpa: time().default('NULL'),
	numeroFmpa: varchar({ length: 500 }).default('NULL'),
	signatureFmpa: int().default(0),
});

export const newForPonctuelleInscription = mysqlTable("new-for-ponctuelle-inscription", {
	idFmpa: int().notNull(),
	idUtilisateur: int().notNull(),
	typeInscription: int().notNull(),
	presenceInscription: int().default(0).notNull(),
	dureePresenceInscription: time().default('NULL'),
	detailsAbscenceInscription: varchar({ length: 500 }).default('NULL'),
	historiqueInscription: longtext().default('NULL'),
});

export const newMcoSettingCity = mysqlTable("new-mco-setting-city", {
	idCity: int().autoincrement().notNull(),
	nameCity: varchar({ length: 500 }).notNull(),
	codeCity: varchar({ length: 500 }).notNull(),
	gpsCity: varchar({ length: 500 }).notNull(),
	contourCity: longtext().notNull(),
});

export const newMcoSettingTruck = mysqlTable("new-mco-setting-truck", {
	idVehicule: int().autoincrement().notNull(),
	libelleVehicule: varchar({ length: 500 }).notNull(),
	piquetVehicule: varchar({ length: 500 }).notNull(),
	ordreVehicule: int().notNull(),
});

export const oldCcoConsignes = mysqlTable("old-cco-consignes", {
	idConsigne: int().autoincrement().notNull(),
	typeConsigne: varchar({ length: 500 }).notNull(),
	dateDebutConsigne: varchar({ length: 500 }).notNull(),
	dateFinConsigne: varchar({ length: 500 }).default('NULL'),
	heureDebutConsigne: varchar({ length: 500 }).default('NULL'),
	heureFinConsigne: varchar({ length: 500 }).default('NULL'),
	journeeConsigne: tinyint().notNull(),
	recurenceConsigne: varchar({ length: 500 }).notNull(),
	libelleConsigne: varchar({ length: 500 }).notNull(),
	detailConsigne: longtext().default('NULL'),
	fichierConsigne: varchar({ length: 500 }).default('NULL'),
	urlConsigne: varchar({ length: 500 }).default('NULL'),
	dateClotureConsgine: varchar({ length: 500 }).default('NULL'),
	utilisateurClotureConsigne: varchar({ length: 500 }).default('NULL'),
	utilisateurCreationConsigne: varchar({ length: 500 }).notNull(),
	idVehicule: varchar({ length: 500 }).default('NULL'),
});

export const phaElementInventaireCompletDesinfection = mysqlTable("pha-element-inventaire-complet-desinfection", {
	idElement: int().autoincrement().notNull(),
	idZone: int().notNull(),
	libelleElement: varchar({ length: 500 }).notNull(),
	messageElement: varchar({ length: 500 }).notNull(),
	imageElement: varchar({ length: 500 }).notNull(),
	positionElement: int().notNull(),
},
(table) => [
	index("idZone").on(table.idZone),
]);

export const phaEmplacement = mysqlTable("pha-emplacement", {
	idEmplacement: int().autoincrement().notNull(),
	libelleEmplacement: varchar({ length: 500 }).notNull(),
	couleurEmplacement: varchar({ length: 500 }).notNull(),
});

export const phaHistoriqueDesinfection = mysqlTable("pha-historique-desinfection", {
	idDesinfection: int().autoincrement().notNull(),
	dateDesinfection: varchar({ length: 500 }).notNull(),
	idIntervention: int().default(0),
	motifDesinfection: varchar({ length: 500 }).default('NULL'),
	vehiculeIntervention: varchar({ length: 500 }).notNull(),
	typeDesinfection: varchar({ length: 500 }).notNull(),
	userDesinfection: varchar({ length: 500 }).notNull(),
});

export const phaItems = mysqlTable("pha-items", {
	idItem: int().autoincrement().notNull(),
	libelleItem: varchar({ length: 500 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateItem: date({ mode: 'string' }).notNull(),
	dateTextItem: varchar({ length: 500 }).notNull(),
	lotItem: int().notNull().references(() => phaLots.idLot, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => [
	index("lotItem").on(table.lotItem),
]);

export const phaItemsLibre = mysqlTable("pha-items-libre", {
	idItem: int().autoincrement().notNull(),
	libelleItem: varchar({ length: 500 }).notNull(),
	quantiteItem: varchar({ length: 500 }).notNull(),
});

export const phaLots = mysqlTable("pha-lots", {
	idLot: int().autoincrement().notNull(),
	libelleLot: varchar({ length: 500 }).notNull(),
	referenceLot: varchar({ length: 500 }).notNull(),
	emplacementLot: int().notNull().references(() => phaEmplacement.idEmplacement, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => [
	index("emplacementLot").on(table.emplacementLot),
]);

export const phaZoneInventaireCompletDesinfection = mysqlTable("pha-zone-inventaire-complet-desinfection", {
	idZone: int().autoincrement().notNull(),
	idVehicule: int().notNull(),
	libelleZone: varchar({ length: 500 }).notNull(),
	positionZone: int().notNull(),
},
(table) => [
	index("idVehicule").on(table.idVehicule),
]);

export const remCarrosserie = mysqlTable("rem-carrosserie", {
	idCarrosserie: int().autoincrement().notNull(),
	idVehicule: int().notNull().references(() => remVehicule.idVehicule, { onDelete: "cascade", onUpdate: "cascade" } ),
	sideCarrosserie: varchar({ length: 500 }).notNull(),
	xCarrosserie: varchar({ length: 500 }).notNull(),
	yCarrosserie: varchar({ length: 500 }).notNull(),
	detailCarrosserie: varchar({ length: 500 }).notNull(),
	ticketCarrosserie: varchar({ length: 500 }).notNull(),
	createurCarrosserie: varchar({ length: 500 }).notNull(),
},
(table) => [
	index("idVehicule").on(table.idVehicule),
]);

export const remCarte = mysqlTable("rem-carte", {
	idCarte: int().autoincrement().notNull(),
	idVehicule: int().notNull().references(() => remVehicule.idVehicule, { onDelete: "cascade", onUpdate: "cascade" } ),
	libelleCarte: varchar({ length: 500 }).notNull(),
	codeCarte: varchar({ length: 500 }).notNull(),
	detailCarte: longtext().notNull(),
	statutCarte: int().default(1).notNull(),
},
(table) => [
	index("idVehicule").on(table.idVehicule),
]);

export const remConsigne = mysqlTable("rem-consigne", {
	idConsigne: int().autoincrement().notNull(),
	libelleConsigne: varchar({ length: 500 }).notNull(),
	detailsConsigne: longtext().notNull(),
	dateDebutConsigne: varchar({ length: 500 }).notNull(),
	dateFinConsigne: varchar({ length: 500 }).notNull(),
	idUserConsigne: int().notNull(),
	affichageCco: int().notNull(),
});

export const remDemandeReparation = mysqlTable("rem-demande-reparation", {
	idReparation: int().autoincrement().notNull(),
	idVehicule: int().notNull().references(() => remVehicule.idVehicule, { onDelete: "cascade", onUpdate: "cascade" } ),
	dateReparation: varchar({ length: 500 }).notNull(),
	detailReparation: varchar({ length: 500 }).notNull(),
	numeroReparation: varchar({ length: 500 }).notNull(),
	createurReparation: varchar({ length: 500 }).notNull(),
	clotureReparation: varchar({ length: 500 }).default('NULL'),
	fermetureReparation: varchar({ length: 500 }).default('NULL'),
	statutDemande: varchar({ length: 500 }).default('\'enkU5SjTkWex3kel+CW/Gw==\''),
	identiteReceveur: longtext().notNull(),
	categorieDemande: varchar({ length: 500 }).notNull(),
	observation: longtext().notNull(),
},
(table) => [
	index("idVehicule").on(table.idVehicule),
]);

export const remDocumentBord = mysqlTable("rem-document-bord", {
	idDocument: int().autoincrement().notNull(),
	idVehicule: int().notNull().references(() => remVehicule.idVehicule, { onDelete: "cascade", onUpdate: "cascade" } ),
	libelleDocument: varchar({ length: 500 }).notNull(),
	dateDocument: varchar({ length: 500 }).notNull(),
	fichierDocument: varchar({ length: 500 }).notNull(),
},
(table) => [
	index("idVehicule").on(table.idVehicule),
]);

export const remEcheance = mysqlTable("rem-echeance", {
	idEcheance: int().autoincrement().notNull(),
	vehiculeEcheance: int().notNull().references(() => remVehicule.idVehicule, { onDelete: "cascade", onUpdate: "cascade" } ),
	libelleEcheance: varchar({ length: 500 }).notNull(),
	detailEcheance: longtext().notNull(),
	dateDebutEcheance: varchar({ length: 500 }).notNull(),
	dateFinEcheance: varchar({ length: 500 }).notNull(),
},
(table) => [
	index("vehiculeEcheance").on(table.vehiculeEcheance),
]);

export const remElementInventaireComplet = mysqlTable("rem-element-inventaire-complet", {
	idElement: int().autoincrement().notNull(),
	idZone: int().notNull().references(() => remZoneInventaireComplet.idZone, { onDelete: "cascade", onUpdate: "cascade" } ),
	libelleElement: varchar({ length: 500 }).notNull(),
	messageElement: varchar({ length: 500 }).notNull(),
	imageElement: varchar({ length: 500 }).notNull(),
	positionElement: int().notNull(),
},
(table) => [
	index("idZone").on(table.idZone),
]);

export const remHistoriqueCarteCarburant = mysqlTable("rem-historique-carte-carburant", {
	idUtilisation: int().autoincrement().notNull(),
	idUtilisateur: int().default(0).references(() => users.refUsers, { onDelete: "set null", onUpdate: "set null" } ),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateHistorique: date({ mode: 'string' }).default('current_timestamp()').notNull(),
	kilometrageHistorique: varchar({ length: 500 }).notNull(),
	litreHistorique: varchar({ length: 500 }).notNull(),
	typePlein: varchar({ length: 500 }).notNull(),
	idCarte: int().notNull().references(() => remCarte.idCarte, { onDelete: "cascade", onUpdate: "cascade" } ),
	commentairePlein: longtext().notNull(),
},
(table) => [
	index("idCarte").on(table.idCarte),
	index("idUtilisateur").on(table.idUtilisateur),
]);

export const remHistoriqueInventaire = mysqlTable("rem-historique-inventaire", {
	idInventaire: int().autoincrement().notNull(),
	idInventaireJournaliere: int().notNull(),
	refUsers: int().notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateInventaire: date({ mode: 'string' }).notNull(),
	rythmeGarde: varchar({ length: 500 }).notNull(),
	elementAbsentInventaire: longtext().notNull(),
	elementAnomalieInventaire: longtext().notNull(),
	commentaireInventaire: varchar({ length: 1000 }).notNull(),
	elementAbsentInventaireFixe: longtext().notNull(),
	elementAnomalieInventaireFixe: longtext().notNull(),
	commentaireInventaireFixe: varchar({ length: 1000 }).notNull(),
	brouillonInventaire: varchar({ length: 500 }).notNull(),
	dataBrouillon: longtext().notNull(),
	utilisateurSupp: varchar({ length: 500 }).notNull(),
});

export const remHistoriqueVerification = mysqlTable("rem-historique-verification", {
	idVerification: int().autoincrement().notNull(),
	idVerificationJournaliere: int().notNull(),
	refUsers: int().notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateVerification: date({ mode: 'string' }).notNull(),
	rythmeGarde: varchar({ length: 500 }).notNull(),
	elementAbsentVerification: longtext().notNull(),
	elementAnomalieVerification: longtext().notNull(),
	commentaireVerification: varchar({ length: 1000 }).notNull(),
	elementAbsentVerificationFixe: longtext().notNull(),
	elementAnomalieVerificationFixe: longtext().notNull(),
	commentaireVerificationFixe: varchar({ length: 1000 }).notNull(),
	brouillonVerification: varchar("BrouillonVerification", { length: 500 }).notNull(),
	dataBrouillon: longtext().notNull(),
	horaireVerif: varchar({ length: 500 }).notNull(),
});

export const remInventaireHebdomadaire = mysqlTable("rem-inventaire-hebdomadaire", {
	idInventaire: int().autoincrement().notNull(),
	idVehicule: int().notNull().references(() => remVehicule.idVehicule, { onDelete: "cascade", onUpdate: "cascade" } ),
	libelleInventaire: varchar({ length: 500 }).notNull(),
	statutInventaire: int().default(0).notNull(),
	positionInventaire: int().notNull(),
	listeElementInventaire: longtext().default('NULL'),
	jourInventaire: varchar({ length: 500 }).notNull(),
	semaineInventaire: varchar({ length: 500 }).notNull(),
},
(table) => [
	index("idVehicule").on(table.idVehicule),
]);

export const remVehicule = mysqlTable("rem-vehicule", {
	idVehicule: int().autoincrement().notNull(),
	libelleVehicule: varchar({ length: 500 }).notNull(),
	immatriculationVehicule: varchar({ length: 500 }).notNull(),
	typeVehicule: varchar({ length: 500 }).notNull(),
	statutVehicule: int().default(0).notNull(),
	carrosserieVehicule: varchar({ length: 500 }).default('NULL'),
	ordreVehicule: int().default(0),
});

export const remVerificationJournaliere = mysqlTable("rem-verification-journaliere", {
	idVerification: int().autoincrement().notNull(),
	idVehicule: int().notNull().references(() => remVehicule.idVehicule, { onDelete: "cascade", onUpdate: "cascade" } ).references(() => remVehicule.idVehicule, { onDelete: "cascade", onUpdate: "cascade" } ),
	libelleVerification: varchar({ length: 500 }).notNull(),
	statutVerification: int().default(0).notNull(),
	positionVerification: int().notNull(),
	listeElementVerification: varchar({ length: 1000 }).default('NULL'),
},
(table) => [
	index("idVehicule").on(table.idVehicule),
]);

export const remZoneInventaireComplet = mysqlTable("rem-zone-inventaire-complet", {
	idZone: int().autoincrement().notNull(),
	idVehicule: int().notNull().references(() => remVehicule.idVehicule, { onDelete: "cascade", onUpdate: "cascade" } ),
	libelleZone: varchar({ length: 500 }).notNull(),
	positionZone: int().notNull(),
},
(table) => [
	index("idVehicule").on(table.idVehicule),
]);

export const userEntree = mysqlTable("user-entree", {
	refUser: int().notNull().references(() => users.refUsers, { onDelete: "cascade", onUpdate: "cascade" } ),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateEntree: date({ mode: 'string' }).notNull(),
});

export const verGardeListe = mysqlTable("ver-garde-liste", {
	idGarde: int().autoincrement().notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateGarde: date({ mode: 'string' }).notNull(),
	heureGarde: time().notNull(),
	idUsers: varchar({ length: 500 }).notNull(),
	rythmeGarde: varchar({ length: 500 }).notNull(),
});
export const users = mysqlView("users", {
	refUsers: int().default(0).notNull(),
	idUsers: varchar({ length: 500 }).notNull(),
	pswdUsers: varchar({ length: 500 }).notNull(),
	nomUsers: varchar({ length: 500 }).notNull(),
	prenomUsers: varchar({ length: 500 }).notNull(),
	emailUsers: varchar({ length: 500 }).notNull(),
	accreditationUsers: tinyint().notNull(),
	dateVisiteMedicalUsers: varchar({ length: 500 }).notNull(),
	datePermisUsers: varchar({ length: 500 }).notNull(),
	dateNaissanceUsers: varchar({ length: 500 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	datePswUser: date({ mode: 'string' }).default('current_timestamp()').notNull(),
	archiveUsers: int().default(0).notNull(),
	photoProfilUser: longtext().default('NULL'),
}).algorithm("undefined").sqlSecurity("invoker").as(sql`select \`skuyrel-dev\`.\`users\`.\`refUsers\` AS \`refUsers\`,\`skuyrel-dev\`.\`users\`.\`idUsers\` AS \`idUsers\`,\`skuyrel-dev\`.\`users\`.\`pswdUsers\` AS \`pswdUsers\`,\`skuyrel-dev\`.\`users\`.\`nomUsers\` AS \`nomUsers\`,\`skuyrel-dev\`.\`users\`.\`prenomUsers\` AS \`prenomUsers\`,\`skuyrel-dev\`.\`users\`.\`emailUsers\` AS \`emailUsers\`,\`skuyrel-dev\`.\`users\`.\`accreditationUsers\` AS \`accreditationUsers\`,\`skuyrel-dev\`.\`users\`.\`dateVisiteMedicalUsers\` AS \`dateVisiteMedicalUsers\`,\`skuyrel-dev\`.\`users\`.\`datePermisUsers\` AS \`datePermisUsers\`,\`skuyrel-dev\`.\`users\`.\`dateNaissanceUsers\` AS \`dateNaissanceUsers\`,\`skuyrel-dev\`.\`users\`.\`datePswUser\` AS \`datePswUser\`,\`skuyrel-dev\`.\`users\`.\`archiveUsers\` AS \`archiveUsers\`,\`skuyrel-dev\`.\`users\`.\`photoProfilUser\` AS \`photoProfilUser\` from (\`skuyrel-dev\`.\`acces_session\` join \`skuyrel-dev\`.\`users\`) where \`skuyrel-dev\`.\`users\`.\`refUsers\` = \`skuyrel-dev\`.\`acces_session\`.\`idUsers\` and \`skuyrel-dev\`.\`acces_session\`.\`idSession\` = 'O08RBkm+Lp0rXC+a7za61w==' and \`skuyrel-dev\`.\`users\`.\`idUsers\` <> ''`);

export const modules = mysqlView("modules", {
	idSession: varchar({ length: 500 }).notNull(),
	idModule: varchar({ length: 3 }).notNull(),
	libelleModule: varchar({ length: 500 }).notNull(),
	superAdminModule: tinyint().default(0).notNull(),
}).algorithm("undefined").sqlSecurity("invoker").as(sql`select \`skuyrel-dev\`.\`acces-modules\`.\`idSession\` AS \`idSession\`,\`skuyrel-dev\`.\`acces-modules\`.\`idModule\` AS \`idModule\`,\`skuyrel-dev\`.\`modules\`.\`libelleModule\` AS \`libelleModule\`,\`skuyrel-dev\`.\`modules\`.\`superAdminModule\` AS \`superAdminModule\` from (\`skuyrel-dev\`.\`acces-modules\` join \`skuyrel-dev\`.\`modules\`) where \`skuyrel-dev\`.\`acces-modules\`.\`idSession\` = 'O08RBkm+Lp0rXC+a7za61w==' and \`skuyrel-dev\`.\`acces-modules\`.\`idModule\` = \`skuyrel-dev\`.\`modules\`.\`idModule\``);