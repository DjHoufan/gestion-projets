"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import { Separator } from "@/core/components/ui/separator";
import {
  Home,
  FolderOpen,
  Users,
  GraduationCap,
  Heart,
  UserCheck,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";

const Guide = () => {
  const tableOfContents = [
    { id: "navigation", title: "Navigation principale", icon: Home },
    { id: "projets", title: "Gestion des Projets", icon: FolderOpen },
    { id: "beneficiaires", title: "Gestion des Bénéficiaires", icon: Users },
    { id: "classes", title: "Gestion des Classes", icon: GraduationCap },
    {
      id: "accompagnements",
      title: "Gestion des Accompagnements",
      icon: Heart,
    },
    { id: "equipes", title: "Gestion des Équipes", icon: UserCheck },
    { id: "rapports", title: "Rapports et Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-orange-500 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Guide Utilisateur</h1>
          <p className="text-xl opacity-90">
            Plateforme HOUFAN - Research & Transform
          </p>
          <Button
            variant="secondary"
            className="mt-6"
            onClick={() => window.print()}
          >
            Imprimer ce guide
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Table of Contents */}
        <Card className="mb-8 bg-slate-800 text-white">
          <CardHeader>
            <CardTitle className="text-white">Table des matières</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors text-blue-300 hover:text-white"
                >
                  <item.icon className="w-5 h-5" />
                  {item.title}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Section */}
        <section id="navigation" className="mb-12">
          <Card className="border-l-4 border-l-teal-600">
            <CardHeader>
              <CardTitle className="text-teal-600 text-2xl">
                Navigation principale
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Tableau de bord principal
                </h3>
                <Badge variant="outline" className="mb-4">
                  Navigation : Page d&apos;accueil après connexion
                </Badge>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/dashboard-main.png"
                    alt="Tableau de bord principal HOUFAN"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Éléments visibles :
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Profil utilisateur avec statut &ldquo;Inactif&rdquo;</li>
                      <li>
                        • Métriques : Total Visites (0), Terminées (0), DJF
                        Dépensés (0), Progression (0%)
                      </li>
                      <li>
                        • Message &ldquo;Aucun accompagnement&rdquo; si aucun accompagnement
                        assigné
                      </li>
                      <li>
                        • Menu latéral : Vue d&apos;ensemble, Projets & Formations,
                        Classes, Bénéficiaires, Accompagnements, Équipes, Outils
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Projects Section */}
        <section id="projets" className="mb-12">
          <Card className="border-l-4 border-l-teal-600">
            <CardHeader>
              <CardTitle className="text-teal-600 text-2xl">
                Gestion des Projets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Vue d&apos;ensemble des projets
                </h3>
                <Badge variant="outline" className="mb-4">
                  Navigation : Projets & Formations &gt; Gestion des formations
                </Badge>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/projects-grid.png"
                    alt="Vue grille des projets avec statistiques"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Statistiques des projets :
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• 4 Total des projets avec répartition par statut</li>
                      <li>
                        • 0 Projets actifs, 2 Projets terminés, 2 Projets à
                        venir
                      </li>
                      <li>
                        • Vue en grille avec cartes individuelles par projet
                      </li>
                      <li>
                        • Informations détaillées : lieu (CASAF), progression,
                        dates, accompagnements
                      </li>
                      <li>
                        • Barres de progression visuelles pour chaque projet
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Création d&apos;un nouveau projet
                </h3>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/new-project-modal.png"
                    alt="Formulaire de création de nouveau projet"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">Champs requis :</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Nom du projet (1-25 caractères)</li>
                      <li>• Lieu du projet (1-25 caractères)</li>
                      <li>• Date de début et date de fin</li>
                      <li>• Validation en temps réel des champs</li>
                      <li>• Boutons d&apos;action : Annuler / Créer le projet</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Modification d&apos;un projet
                </h3>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/edit-project-modal.png"
                    alt="Formulaire de modification de projet"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Fonctionnalités d&apos;édition :
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>
                        • Modification des informations existantes du projet
                      </li>
                      <li>• Champs pré-remplis avec les données actuelles</li>
                      <li>• Validation des contraintes de caractères</li>
                      <li>• Mise à jour des dates de début et fin</li>
                      <li>• Boutons d&apos;action : Annuler / Modifier</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Détails d&apos;un projet
                </h3>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/project-details.png"
                    alt="Vue détaillée du projet Cohorte 2"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Informations détaillées :
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>
                        • Métriques colorées : Groupes, Accompagnateurs, Membres
                        (220), Abandons
                      </li>
                      <li>• Indicateurs temporels : 35 Jours restants</li>
                      <li>
                        • Progression du projet : 100% pour les projets terminés
                      </li>
                      <li>
                        • Section de recherche pour les groupes d&apos;accompagnement
                      </li>
                      <li>
                        • Boutons d&apos;action : &ldquo;En cours&rdquo; et &ldquo;Enregistre un
                        abandon&rdquo;
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Tableau de bord des projets récents
                </h3>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/dashboard-recent.png"
                    alt="Tableau de bord avec projets récents et statistiques utilisateurs"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Projets récents :
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>
                          • Liste des projets avec statuts (En cours, Terminé)
                        </li>
                        <li>
                          • Informations : participants, lieu (CASAF), dates
                        </li>
                        <li>• Cohorte 3 : En cours, 206 participants</li>
                        <li>• Cohorte 1 : Terminé, 4 participants</li>
                        <li>• Cohorte 2 : En cours, 220 participants</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Statistiques utilisateurs :
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• 51 total utilisateurs répartis par type</li>
                        <li>• 25 Accompagnateur(trices)</li>
                        <li>• 16 Formateur(trices)</li>
                        <li>• 9 Administrateurs</li>
                        <li>• Statut des comptes : 51 Actifs, 0 Désactivés</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Activités hebdomadaires
                </h3>
                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/dashboard-activities.png"
                    alt="Graphique des activités hebdomadaires"
                    width={800}
                    height={300}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Informations affichées :
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>
                        • Répartition des activités par jour de la semaine
                      </li>
                      <li>• Suivi des visites, rencontres et conflits</li>
                      <li>
                        • Statistiques détaillées : Groupes, Accompagnateurs,
                        Membres, Abandons
                      </li>
                      <li>
                        • Progression en temps réel (100% pour projets terminés)
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Beneficiaries Section */}
        <section id="beneficiaires" className="mb-12">
          <Card className="border-l-4 border-l-teal-600">
            <CardHeader>
              <CardTitle className="text-teal-600 text-2xl">
                Gestion des Bénéficiaires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Liste des bénéficiaires
                </h3>
                <Badge variant="outline" className="mb-4">
                  Navigation : Bénéficiaires
                </Badge>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/beneficiaries-list.png"
                    alt="Liste complète des bénéficiaires avec détails"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Vue liste détaillée :
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>
                        • Informations complètes : nom, téléphone, adresse, date
                        de naissance
                      </li>
                      <li>
                        • Indicateurs de genre avec badges colorés (Femme)
                      </li>
                      <li>• Langues parlées (somali, afar, arabe)</li>
                      <li>
                        • Attestations et formations (Formation en cuisine,
                        Informatique, Coiffure)
                      </li>
                      <li>• Statut handicap et statut actif/inactif</li>
                      <li>• Pagination : 220 résultats, Page 1 sur 22</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Vue avec métriques du projet
                </h3>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/beneficiaries-with-metrics.png"
                    alt="Bénéficiaires avec métriques colorées du projet"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Métriques du projet :
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Cartes métriques colorées en haut de page</li>
                      <li>
                        • 0 Abandons (rouge), 35 Jours restants (bleu), 100%
                        Progression (orange)
                      </li>
                      <li>
                        • 0 Groupes d&apos;accompagnement, 0 Accompagnateurs, 220
                        Membres
                      </li>
                      <li>
                        • Section &ldquo;Groupes d&apos;accompagnement&rdquo; avec recherche
                      </li>
                      <li>
                        • Liste des bénéficiaires avec informations détaillées
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Vue données avec filtres
                </h3>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/beneficiaries-data-view.png"
                    alt="Vue données des bénéficiaires avec filtres avancés"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Fonctionnalités avancées :
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Onglets &ldquo;Statistique&rdquo; et &ldquo;Données&rdquo; (actif)</li>
                      <li>• Filtres multiples : handicap, projet, statut</li>
                      <li>• Recherche par nom ou date</li>
                      <li>
                        • Tableau complet avec colonnes : Bénéficiaire, Adresse,
                        Date de naissance, Langue, Attestation, Projet,
                        Handicap, Statut, Actions
                      </li>
                      <li>• Bouton &ldquo;Enregistre un nouveau bénéficiaire&rdquo;</li>
                      <li>
                        • Informations détaillées par bénéficiaire (Cohorte 2,
                        CASAF, statuts actifs)
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Ajout d&apos;un bénéficiaire
                </h3>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/member-details-form.png"
                    alt="Formulaire d&apos;ajout de nouveau bénéficiaire"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Formulaire complet :
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>
                        • Section profil avec upload de photo (PNG, JPG, JPEG)
                      </li>
                      <li>• Sélection du projet et de la classe</li>
                      <li>
                        • Informations personnelles : nom complet, téléphone,
                        genre, date de naissance
                      </li>
                      <li>• Localisation : commune et quartier résidentiel</li>
                      <li>• Validation des champs obligatoires</li>
                      <li>
                        • Interface moderne avec icônes et design cohérent
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Modification d&apos;un bénéficiaire
                </h3>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/member-edit-form.png"
                    alt="Formulaire de modification d&apos;un bénéficiaire existant"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Formulaire de modification :
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>
                        • Photo de profil avec possibilité de modification
                      </li>
                      <li>
                        • Champs pré-remplis : téléphone, genre (Femme), date de
                        naissance
                      </li>
                      <li>• Localisation : commune et quartier résidentiel</li>
                      <li>• Type de handicap (Pas de Handicap) et langue</li>
                      <li>• Section attestation avec zone de texte</li>
                      <li>
                        • Bouton &ldquo;Modifier&rdquo; pour sauvegarder les changements
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Profil détaillé d&apos;un bénéficiaire
                </h3>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/beneficiary-profile.png"
                    alt="Profil détaillé de Mahdia Kadir Houssein"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">Page de profil :</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>
                        • En-tête avec nom, genre (femme) et statut (Inactif)
                      </li>
                      <li>
                        • Métriques personnelles : 0 Total Visites, 0 Terminées,
                        0 DJF Dépensés, 0% Progression
                      </li>
                      <li>
                        • Message &ldquo;Aucun accompagnement&rdquo; si aucun accompagnement
                        assigné
                      </li>
                      <li>
                        • Interface cohérente avec le design général de la
                        plateforme
                      </li>
                      <li>
                        • Cartes métriques avec icônes et couleurs distinctives
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Fiche bénéficiaire complète
                </h3>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/beneficiary-detailed-modal.png"
                    alt="Fiche détaillée complète de Mahdia Kadir Houssein"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Sections détaillées :
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>
                        • <strong>Informations Personnelles :</strong> Téléphone
                        (N/A), Date de naissance (19 août 2025), Langue (N/A)
                      </li>
                      <li>
                        • <strong>Localisation :</strong> Commune (N/A), Adresse
                        résidentielle (N/A)
                      </li>
                      <li>
                        • <strong>Formation & Compétences :</strong> Attestation
                        (N/A), Handicap (Pas de Handicap)
                      </li>
                      <li>
                        • <strong>Statut du Projet :</strong> Projet (Cohorte
                        2), Statut (Inactif), Inscrit le (19 août 2025)
                      </li>
                      <li>
                        • Interface organisée en sections avec icônes
                        distinctives
                      </li>
                      <li>• Modal responsive avec design moderne</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Classes Section */}
        <section id="classes" className="mb-12">
          <Card className="border-l-4 border-l-teal-600">
            <CardHeader>
              <CardTitle className="text-teal-600 text-2xl">
                Gestion des Classes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Liste des classes
                </h3>
                <Badge variant="outline" className="mb-4">
                  Navigation : Classes
                </Badge>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/classes-list.png"
                    alt="Liste des classes avec formateurs et projets"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">Vue d&apos;ensemble :</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>
                        • Tableau avec colonnes : Classe, Formateur/Formatrice,
                        Projet, Actions
                      </li>
                      <li>
                        • Classe &ldquo;TEST1&rdquo; avec formatrice Kadra Abdi Ismail
                      </li>
                      <li>
                        • Projet associé : Cohorte 1 (CASAF, 01/07/2025 -
                        01/08/2025)
                      </li>
                      <li>• Filtres par projet et formateur/formatrice</li>
                      <li>• Recherche par nom ou date</li>
                      <li>• Bouton &ldquo;Enregistre une nouvelle classe&rdquo;</li>
                      <li>• Pagination : 1 résultat, 10 par page</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Création d&apos;une classe
                </h3>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/class-details-form.png"
                    alt="Formulaire de création de nouvelle classe"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Formulaire de création :
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Nom de la classe (champ obligatoire avec icône)</li>
                      <li>
                        • Sélection du projet (dropdown avec icône projet)
                      </li>
                      <li>
                        • Assignation du formateur/formatrice (dropdown avec
                        icône utilisateur)
                      </li>
                      <li>• Bouton &ldquo;Enregistrer&rdquo; pour valider la création</li>
                      <li>• Interface moderne avec design cohérent HOUFAN</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Modification d&apos;une classe
                </h3>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/class-edit-form.png"
                    alt="Formulaire de modification de classe existante"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">Modification :</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Champs pré-remplis avec les données existantes</li>
                      <li>• Nom de classe &ldquo;test1&rdquo; modifiable</li>
                      <li>• Projet &ldquo;Cohorte 1&rdquo; pré-sélectionné</li>
                      <li>• Formatrice &ldquo;Kadra Abdi Ismail&rdquo; pré-sélectionnée</li>
                      <li>
                        • Bouton &ldquo;Modifier&rdquo; pour sauvegarder les changements
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Détails d&apos;une classe
                </h3>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/class-detailed-view.png"
                    alt="Vue détaillée de la classe test1 avec suivi des bénéficiaires"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Informations détaillées :
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>
                        • Titre de la classe &ldquo;test1&rdquo; avec sous-titre &ldquo;Suivi de
                        la classe&rdquo;
                      </li>
                      <li>• Projet associé : Cohorte 1</li>
                      <li>• Lieu de formation : CASAF, 1 participante</li>
                      <li>• Dates : 1 juillet 2025 - 1 août 2025</li>
                      <li>
                        • Formatrice : Kadra Abdi Ismail avec photo de profil et
                        contact
                      </li>
                      <li>
                        • Email : assoweh22@outlook.com, Téléphone : 77869967,
                        Localisation : Djibouti Ville
                      </li>
                      <li>
                        • Filtres par handicap et statut pour les bénéficiaires
                      </li>
                      <li>
                        • Tableau des bénéficiaires avec informations complètes
                      </li>
                      <li>• Bouton &ldquo;Enregistre un nouveau bénéficiaire&rdquo;</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Accompaniments Section */}
        <section id="accompagnements" className="mb-12">
          <Card className="border-l-4 border-l-teal-600">
            <CardHeader>
              <CardTitle className="text-teal-600 text-2xl">
                Gestion des Accompagnements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Vue d&apos;ensemble des accompagnements
                </h3>
                <Badge variant="outline" className="mb-4">
                  Navigation : Accompagnements &gt; Gestion des Accompagnements
                </Badge>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/accompaniment-management.png"
                    alt="Page de gestion des accompagnements avec statistiques"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Statistiques détaillées :
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>
                        • <strong>Total Accompagnements :</strong> 1 (+2 depuis
                        le mois dernier)
                      </li>
                      <li>
                        • <strong>En Cours :</strong> 1 accompagnement actif
                      </li>
                      <li>
                        • <strong>Terminés :</strong> 0 accompagnement finalisé
                      </li>
                      <li>
                        • Section &ldquo;Accompagnements Récents&rdquo; avec détails
                        complets
                      </li>
                      <li>
                        • Accompagnement &ldquo;test 1&rdquo; - Statut &ldquo;En cours&rdquo; - Projet
                        &ldquo;Cohorte 1&rdquo;
                      </li>
                      <li>• Informations de contact : test test, 77000203</li>
                      <li>• Budget alloué : 80 000 Fdj</li>
                      <li>
                        • Bouton &ldquo;Nouvel Accompagnement&rdquo; pour créer de nouveaux
                        accompagnements
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Création d&apos;un nouvel accompagnement
                </h3>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/new-accompaniment-form.png"
                    alt="Formulaire de création d&apos;un nouvel accompagnement"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Formulaire complet :
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>
                        • <strong>Informations Générales :</strong> Sélection du
                        projet, nom du business, accompagnateur
                      </li>
                      <li>
                        • <strong>Localisation :</strong> Adresse complète
                        précise (ex: 123 Rue de l&apos;Innovation, 75001 Paris)
                      </li>
                      <li>
                        • <strong>Les bénéficiaires :</strong> Section pour
                        ajouter les membres à l&apos;accompagnement
                      </li>
                      <li>
                        • Champs avec icônes distinctives pour chaque section
                      </li>
                      <li>
                        • Interface moderne avec validation des champs
                        obligatoires
                      </li>
                      <li>
                        • Exemple de nom de business : &ldquo;Formation Digital
                        Marketing&rdquo;
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Enregistrement d&apos;abandon
                </h3>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/abandonment-form.png"
                    alt="Formulaire de modification d&apos;abandon"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Informations requises :
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>
                        • Date de congé (05/09/2025) avec sélecteur de date
                      </li>
                      <li>• Sélection de la cohorte (Cohorte 2)</li>
                      <li>
                        • Raison de l&apos;abandon (zone de texte 0/1000 caractères)
                      </li>
                      <li>• Boutons d&apos;action : Annuler / Enregistrer</li>
                      <li>• Formulaire modal avec validation des champs</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Teams Section */}
        <section id="equipes" className="mb-12">
          <Card className="border-l-4 border-l-teal-600">
            <CardHeader>
              <CardTitle className="text-teal-600 text-2xl">
                Gestion des Équipes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Employés, Accompagnateurs & Formateurs
                </h3>
                <Badge variant="outline" className="mb-4">
                  Navigation : Équipes &gt; Gestion de l&apos;équipe
                </Badge>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/team-management.png"
                    alt="Page de gestion des équipes avec onglets et liste des employés"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Interface de gestion :
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>
                        • <strong>Titre coloré :</strong> &ldquo;Employé(e)s,
                        Accompagnateurs & Formateurs&rdquo; avec dégradé de couleurs
                      </li>
                      <li>
                        • <strong>Onglets :</strong> Employé(e)s (actif),
                        Accompagnateurs, Formateurs
                      </li>
                      <li>
                        • <strong>Section active :</strong> &ldquo;Liste des
                        employé(e)s&rdquo; avec description
                      </li>
                      <li>
                        • <strong>Tableau détaillé :</strong> Utilisateur,
                        Téléphone, Adresse, Âge, Genre, Statut, Actions
                      </li>
                      <li>
                        • <strong>Employé affiché :</strong> Akis Med
                        (akis.med05@gmail.com)
                      </li>
                      <li>
                        • <strong>Détails :</strong> 77231659, akis, 0 ans,
                        Homme, Statut Actif
                      </li>
                      <li>
                        • <strong>Fonctionnalités :</strong> Recherche par nom
                        ou date, pagination (1 résultat, 10 par page)
                      </li>
                      <li>
                        • <strong>Bouton d&apos;action :</strong> &ldquo;Enregistre un
                        nouveau Utilisateurs&rdquo;
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Détails de projet avec géolocalisation
                </h3>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/project-gps-details.png"
                    alt="Vue détaillée du projet test 1 avec carte GPS interactive"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Fonctionnalités avancées :
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>
                        • <strong>Métriques colorées :</strong> Budget Alloué
                        (80 000 FDJ), Bénéficiaires (1), Visites Planifiées (0),
                        Dépenses (0 FDJ)
                      </li>
                      <li>
                        • <strong>Navigation par onglets :</strong> Vue
                        d&apos;ensemble, Bénéficiaires, Planning, Achats,
                        Localisations (actif), Média
                      </li>
                      <li>
                        • <strong>Section GPS :</strong> &ldquo;Localisations GPS&rdquo;
                        avec points de géolocalisation
                      </li>
                      <li>
                        • <strong>Carte interactive :</strong> Vue satellite HD
                        avec contrôles de zoom
                      </li>
                      <li>
                        • <strong>Fonctionnalités :</strong> Bouton &ldquo;Ajouter une
                        localisation&rdquo; et &ldquo;Consulter le plan d&apos;affaires&rdquo;
                      </li>
                      <li>
                        • <strong>Interface moderne :</strong> Cartes métriques
                        avec icônes et couleurs distinctives
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Reports Section */}
        <section id="rapports" className="mb-12">
          <Card className="border-l-4 border-l-teal-600">
            <CardHeader>
              <CardTitle className="text-teal-600 text-2xl">
                Rapports et Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  Gestion des rapports
                </h3>
                <Badge variant="outline" className="mb-4">
                  Navigation : Rapports &gt; Analytics détaillées
                </Badge>

                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4">
                  <Image
                    src="/guide/report-management.png"
                    alt="Page de gestion des rapports avec types de rapports disponibles"
                    width={800}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Interface de gestion des rapports :
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>
                        • <strong>Titre :</strong> &ldquo;Gestion des rapports&rdquo; avec
                        sous-titre &ldquo;Formulaires et documents&rdquo;
                      </li>
                      <li>
                        • <strong>Section gauche :</strong> &ldquo;LES DIFFÉRENTS
                        RAPPORTS&rdquo; avec liste des types
                      </li>
                      <li>
                        • <strong>Types disponibles :</strong>
                      </li>
                      <li className="ml-4">
                        - Émargement (Gestion des signatures)
                      </li>
                      <li className="ml-4">
                        - Visite Terrain (Visites sur le terrain)
                      </li>
                      <li className="ml-4">
                        - Conflits (Gestion des conflits)
                      </li>
                      <li className="ml-4">
                        - Rencontres (Organisation des réunions)
                      </li>
                      <li className="ml-4">
                        - Rapport (Rapport des formateurs)
                      </li>
                      <li>
                        • <strong>Section droite :</strong> Tableau avec
                        colonnes (Bénéficiaire, Accompagnateur, Date, Montant,
                        Signature, Actions)
                      </li>
                      <li>
                        • <strong>État :</strong> &ldquo;Aucun résultat trouvé&rdquo; - 0
                        résultat, pagination Page 1 sur 1
                      </li>
                      <li>
                        • <strong>Fonctionnalités :</strong> Recherche par nom
                        ou date, filtrage des résultats
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Important Actions Section */}
        <Card className="bg-orange-500 text-white mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Actions importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Suppression de données</h4>
              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <Image
                  src="/guide/delete-confirmation.png"
                  alt="Confirmation de suppression de projet"
                  width={600}
                  height={300}
                  className="w-full rounded-lg"
                />
              </div>
              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <Image
                  src="/guide/delete-confirmation-class.png"
                  alt="Confirmation de suppression de classe"
                  width={600}
                  height={300}
                  className="w-full rounded-lg"
                />
              </div>
              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <Image
                  src="/guide/beneficiary-delete-confirmation.png"
                  alt="Confirmation de suppression de bénéficiaire Mahdia Kadir Houssein"
                  width={600}
                  height={300}
                  className="w-full rounded-lg"
                />
              </div>
              <p className="text-sm mb-2">
                <strong>Attention :</strong> La suppression de projets comme
                &ldquo;Cohorte 2&rdquo;, de classes comme &ldquo;test1&rdquo;, ou de bénéficiaires comme
                &ldquo;Mahdia Kadir Houssein&rdquo; est une action irréversible signalée par
                un avertissement.
              </p>
            </div>

            <p className="mb-4">
              <strong>Attention :</strong> Les suppressions de données sont des
              actions irréversibles. Assurez-vous de bien vérifier avant de
              confirmer toute suppression.
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                • Design moderne avec thème cyan (#16a085) et orange (#f39c12)
              </li>
              <li>• Navigation sidebar fixe avec sections organisées</li>
              <li>• Formulaires modaux pour les actions importantes</li>
              <li>
                • Pagination pour les listes importantes (ex: 220 résultats,
                Page 1 sur 22)
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="bg-slate-100">
          <CardHeader>
            <CardTitle className="text-slate-700">
              Support et contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Pour toute assistance technique ou question sur l&apos;utilisation de
              la plateforme HOUFAN, contactez l&apos;équipe support.
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Plateforme :</strong> HOUFAN Research & Transform
              </p>
              <p>
                <strong>Interface :</strong> Design moderne avec navigation
                intuitive
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Guide;