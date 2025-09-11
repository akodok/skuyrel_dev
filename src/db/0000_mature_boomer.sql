-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `acces-modules` (
	`idSession` varchar(500) NOT NULL,
	`idModule` varchar(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `acces_session` (
	`idUsers` int(11) NOT NULL,
	`idSession` varchar(500) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `bugs` (
	`idBug` int(11) AUTO_INCREMENT NOT NULL,
	`dateTimeBug` datetime NOT NULL DEFAULT 'current_timestamp()',
	`nomBug` varchar(500) NOT NULL,
	`prenomBug` varchar(500) NOT NULL,
	`sessionBug` varchar(500) NOT NULL,
	`moduleBug` varchar(500) NOT NULL,
	`detailsBug` varchar(500) NOT NULL,
	`statutBug` int(11) NOT NULL DEFAULT 0,
	`annotationBug` longtext NOT NULL
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`idModule` varchar(3) NOT NULL,
	`libelleModule` varchar(500) NOT NULL,
	`superAdminModule` tinyint(4) NOT NULL DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `session` (
	`idSession` varchar(500) NOT NULL,
	`dbSession` varchar(500) NOT NULL,
	`libelleSession` varchar(500) NOT NULL,
	`typeSession` varchar(500) NOT NULL,
	`logoSession` varchar(500) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`refUsers` int(11) AUTO_INCREMENT NOT NULL,
	`idUsers` varchar(500) NOT NULL,
	`pswdUsers` varchar(500) NOT NULL,
	`nomUsers` varchar(500) NOT NULL,
	`prenomUsers` varchar(500) NOT NULL,
	`emailUsers` varchar(500) NOT NULL,
	`accreditationUsers` tinyint(1) NOT NULL,
	`dateVisiteMedicalUsers` varchar(500) NOT NULL,
	`datePermisUsers` varchar(500) NOT NULL,
	`datePermisAmbulance` date DEFAULT 'NULL',
	`dateFAE` date DEFAULT 'NULL',
	`permisB` int(11) DEFAULT 'NULL',
	`permisBE` int(11) DEFAULT 'NULL',
	`permisC1E` date DEFAULT 'NULL',
	`dateNaissanceUsers` varchar(500) NOT NULL,
	`datePswUser` date NOT NULL DEFAULT 'current_timestamp()',
	`archiveUsers` int(11) NOT NULL DEFAULT 0,
	`photoProfilUser` longtext DEFAULT 'NULL'
);
--> statement-breakpoint
ALTER TABLE `acces-modules` ADD CONSTRAINT `acces-modules_ibfk_1` FOREIGN KEY (`idModule`) REFERENCES `modules`(`idModule`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `acces-modules` ADD CONSTRAINT `acces-modules_ibfk_2` FOREIGN KEY (`idSession`) REFERENCES `session`(`idSession`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `acces_session` ADD CONSTRAINT `acces_session_ibfk_1` FOREIGN KEY (`idSession`) REFERENCES `session`(`idSession`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `acces_session` ADD CONSTRAINT `acces_session_ibfk_2` FOREIGN KEY (`idUsers`) REFERENCES `users`(`refUsers`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `idModule` ON `acces-modules` (`idModule`);--> statement-breakpoint
CREATE INDEX `idSession` ON `acces_session` (`idSession`);
*/