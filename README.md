Atomic Design + Feature-Based Architecture

# Construire l'image Docker

docker-compose build

# Démarrer le conteneur

docker-compose up -d

alpha/
├── public/
│ ├── assets/
│ │ ├── 1.jpg
│ │ ├── 2.jpg
│ │ ├── 3 (2).jpg
│ │ ├── PIC.jpeg
│ │ ├── Rayan.jpg
│ │ ├── aceuiloddl.png
│ │ ├── atel.jpg
│ │ ├── bangodhe1.jpg
│ │ ├── bangodhe2.jpg
│ │ ├── cadre.jpeg
│ │ ├── cid1.jpeg
│ │ ├── d.jpg
│ │ ├── dir.jpeg
│ │ ├── directeur.jpeg
│ │ ├── dur.jpeg
│ │ ├── ense.jpeg
│ │ ├── final.jpg
│ │ ├── giz.jpeg
│ │ ├── hazo.jpeg
│ │ ├── images
│ │ ├── mada.jpeg
│ │ ├── madagasikara.jpeg
│ │ ├── mdat-banner.jpg
│ │ ├── mdat.jpeg
│ │ ├── mdata.jpeg
│ │ ├── mionjo.jpeg
│ │ ├── oddl.jpg
│ │ ├── organigrame.jpeg
│ │ ├── organigrame.jpg
│ │ ├── pnud.jpeg
│ │ ├── rayan2.jpg
│ │ ├── tech.jpg
│ │ ├── unic.jpeg
│ │ ├── unicef.png
│ │ └── val.jpg
│ ├── document/
│ │ ├── 57.pdf
│ │ ├── 58.pdf
│ │ ├── 59.pdf
│ │ ├── 60.pdf
│ │ ├── 61.pdf
│ │ ├── 62.pdf
│ │ ├── 63.pdf
│ │ ├── 64.pdf
│ │ ├── 65.pdf
│ │ ├── 66.pdf
│ │ ├── 67.pdf
│ │ ├── 68.pdf
│ │ ├── 69.pdf
│ │ ├── 70.pdf
│ │ ├── 71.pdf
│ │ ├── 72.pdf
│ │ ├── 73.pdf
│ │ ├── Guide_Conseiller.pdf
│ │ ├── Guide_du_Maire.pdf
│ │ ├── Guide_passation_services_VF_réaménagé.pdf
│ │ └── politique.pdf
│ ├── file.svg
│ ├── globe.svg
│ ├── next.svg
│ ├── vercel.svg
│ └── window.svg
├── src/
│ ├── app/
│ │ ├── (admin)/
│ │ │ ├── dashboard/
│ │ │ │ ├── commune/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── dbcommune/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── dbdistrict/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── dboddlo/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── dboddseize/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── dbregion/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── oddl/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── parametre/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── region/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── role/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── users/
│ │ │ │ │ └── page.tsx
│ │ │ │ └── page.tsx
│ │ │ └── layout.tsx
│ │ ├── (auth)/
│ │ │ ├── login/
│ │ │ │ └── page.tsx
│ │ │ ├── register/
│ │ │ │ └── page.tsx
│ │ │ └── layout.tsx
│ │ ├── (public)/
│ │ │ │ ├── contact/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── directeur/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── document/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── galerie/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── historique/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── juridique/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── mission/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── organigramme/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── partenaires/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── ressources/
│ │ │ │ │ └── page.tsx
│ │ │ │ └── textes/
│ │ │ │ └── page.tsx
│ │ │ | ├── layout.tsx
│ │ │ | └── page.tsx
│ │ ├── api/
│ │ │ └── auth/
│ │ │ └── [...nextauth]/
│ │ │ └── route.ts
│ │ ├── favicon.ico
│ │ ├── globals.css
│ │ └── layout.tsx
│ ├── components/
│ │ ├── ui/
│ │ │ ├── atomes/
│ │ │ │ ├── PasswordInput.tsx
│ │ │ │ ├── alert.tsx
│ │ │ │ ├── button.tsx
│ │ │ │ ├── checkbox.tsx
│ │ │ │ ├── input.tsx
│ │ │ │ ├── label.tsx
│ │ │ │ ├── separator.tsx
│ │ │ │ ├── skeleton.tsx
│ │ │ │ ├── switch.tsx
│ │ │ │ ├── textarea.tsx
│ │ │ │ ├── toast.tsx
│ │ │ │ └── use-toast.ts
│ │ │ ├── molécules/
│ │ │ │ ├── DeleteConfirmationModal.tsx
│ │ │ │ ├── UpdateConfirmationModal.tsx
│ │ │ │ ├── YearSelector.tsx
│ │ │ │ ├── alert.tsx
│ │ │ │ ├── breadcrumb.tsx
│ │ │ │ ├── card.tsx
│ │ │ │ ├── dialog.tsx
│ │ │ │ ├── select.tsx
│ │ │ │ ├── sidebar.tsx
│ │ │ │ ├── table-skeleton.tsx
│ │ │ │ ├── tabs.tsx
│ │ │ │ ├── toast.tsx
│ │ │ │ └── tooltip.tsx
│ │ │ ├── organismes/
│ │ │ │ ├── dialog.tsx
│ │ │ │ ├── pagination.tsx
│ │ │ │ ├── sheet.tsx
│ │ │ │ └── table.tsx
│ │ │ └── templates/
│ │ │ ├── CategoryFilter.tsx
│ │ │ ├── ImageModal.tsx
│ │ │ ├── PageHeader.tsx
│ │ │ ├── PageHeaderMenu.tsx
│ │ │ ├── SectionHeader.tsx
│ │ │ ├── collapsible.tsx
│ │ │ ├── motion.tsx
│ │ │ └── skeleton.tsx
│ │ ├── Footer.tsx
│ │ ├── MobileMenu.tsx
│ │ ├── app-sidebar.tsx
│ │ ├── public-navbar.tsx
│ │ ├── search-form.tsx
│ │ └── use-mobile.tsx
│ ├── feature/
│ │ ├── auth/
│ │ │ ├── context/
│ │ │ │ └── AuthProvider.tsx
│ │ │ ├── hooks/
│ │ │ │ ├── useLogin.ts
│ │ │ │ └── useRegister.ts
│ │ │ ├── login/
│ │ │ │ └── LoginForm.tsx
│ │ │ ├── register/
│ │ │ │ └── RegisterForm.tsx
│ │ │ ├── AuthSessionProvider.tsx
│ │ │ ├── ProtectedRoute.tsx
│ │ │ ├── ValidateSignupForm.tsx
│ │ │ └── vanguad.tsx
│ │ ├── dashboard/
│ │ │ └── DashboardContent.tsx
│ │ ├── dbDistrict/
│ │ │ ├── CommuneInDistrictList.tsx
│ │ │ └── DistrictRow.tsx
│ │ ├── dbcommune/
│ │ │ ├── dbcommunerow/
│ │ │ │ ├── DbCommuneDemographieRow.tsx
│ │ │ │ ├── DbCommuneEconomieRow.tsx
│ │ │ │ ├── DbCommuneEducationRow.tsx
│ │ │ │ ├── DbCommuneEnvironnementRow.tsx
│ │ │ │ ├── DbCommuneGouvernanceRow.tsx
│ │ │ │ ├── DbCommuneInfoGenRow.tsx
│ │ │ │ ├── DbCommuneInfrastructureRow.tsx
│ │ │ │ ├── DbCommunePersonnelRow.tsx
│ │ │ │ ├── DbCommuneSanteRow.tsx
│ │ │ │ └── DbCommuneSecuriteRow.tsx
│ │ │ ├── CommuneList.tsx
│ │ │ ├── DbCommuneContent.tsx
│ │ │ └── DbCommuneRow.tsx
│ │ ├── dboddl/
│ │ │ ├── DbDataContent.tsx
│ │ │ ├── DbOddlContent.tsx
│ │ │ ├── DbOddlSeizeContent.tsx
│ │ │ ├── EditOddSeizeForm.tsx
│ │ │ ├── EditOddlForm.tsx
│ │ │ ├── ODDLRow.tsx
│ │ │ ├── ODDLSeizeRow.tsx
│ │ │ └── RegionList.tsx
│ │ ├── dbregion/
│ │ │ ├── dbregionrow/
│ │ │ │ ├── DbRegionEnvironnementRow.tsx
│ │ │ │ ├── DbRegionGouvernanceRow.tsx
│ │ │ │ ├── DbRegionInfoGenRow.tsx
│ │ │ │ ├── DbRegionSectorielRow.tsx
│ │ │ │ ├── DbRegionStaffCROCRow.tsx
│ │ │ │ └── DbRegionStaffRow.tsx
│ │ │ ├── CommuneInRegionList.tsx
│ │ │ ├── DbRegionContent.tsx
│ │ │ ├── DbRegionRow.tsx
│ │ │ └── EditRegionForm.tsx
│ │ ├── indcommune/
│ │ │ ├── CarteCommune.tsx
│ │ │ ├── CommuneContent.tsx
│ │ │ ├── DemoCOmTab.tsx
│ │ │ ├── EcoComTab.tsx
│ │ │ ├── EnviComTab.tsx
│ │ │ ├── GouverComTab.tsx
│ │ │ ├── MapComponent.tsx
│ │ │ └── SocialCOmTab.tsx
│ │ ├── indoddl/
│ │ │ ├── ODDLTabs/
│ │ │ │ ├── InvestissementAutonomieFinanciere.tsx
│ │ │ │ ├── MobilisationRessourcesHumaines.tsx
│ │ │ │ ├── PerformanceFinanciereBudgetaire.tsx
│ │ │ │ ├── PlanificationComptabilite.tsx
│ │ │ │ ├── QualiteGouvernanceLocale.tsx
│ │ │ │ └── ScoringPerformanceAdmin.tsx
│ │ │ └── ODDLContent.tsx
│ │ ├── indregion/
│ │ │ └── RegionContent.tsx
│ │ ├── parametre/
│ │ │ └── ParametreContent.tsx
│ │ ├── publicPage/
│ │ │ ├── Acceuil/
│ │ │ │ ├── AccueilPage.tsx
│ │ │ │ └── ActualiteContent.tsx
│ │ │ ├── contact/
│ │ │ │ └── ContactPage.tsx
│ │ │ ├── document/
│ │ │ │ └── DocumentPage.tsx
│ │ │ ├── galerie/
│ │ │ │ └── GaleriePage.tsx
│ │ │ ├── historique/
│ │ │ │ └── HitoriquePage.tsx
│ │ │ ├── juridique/
│ │ │ │ └── JuridiquePage.tsx
│ │ │ ├── mission/
│ │ │ │ └── MissionPage.tsx
│ │ │ ├── mot-dir/
│ │ │ │ └── MotDirPage.tsx
│ │ │ ├── organigrame/
│ │ │ │ └── OrganigramePage.tsx
│ │ │ ├── partenaire/
│ │ │ │ └── PartenairePage.tsx
│ │ │ ├── ressources/
│ │ │ │ └── RessourcePage.tsx
│ │ │ └── textes/
│ │ │ └── TextePage.tsx
│ │ ├── role/
│ │ │ ├── RoleContent.tsx
│ │ │ └── RoleRow.tsx
│ │ └── users/
│ │ ├── UserContent.tsx
│ │ └── UserRow.tsx
│ ├── lib/
│ │ ├── utils.ts
│ │ └── yearUtils.ts
│ ├── services/
│ │ ├── api/
│ │ │ ├── auth/
│ │ │ │ ├── cancel-signup.api.ts
│ │ │ │ ├── login.api.ts
│ │ │ │ ├── register.api.ts
│ │ │ │ └── validate-signup.api.ts
│ │ │ ├── commune/
│ │ │ │ ├── base-update-status-commune.api.ts
│ │ │ │ └── get-dbCommune.api.ts
│ │ │ ├── maj/
│ │ │ │ └── maj-donne.api.ts
│ │ │ ├── oddl/
│ │ │ │ ├── get-all-region-list.api.ts
│ │ │ │ ├── get-odd-seize.api.ts
│ │ │ │ ├── get-odd.api.ts
│ │ │ │ ├── indic-invest-oddl.api.ts
│ │ │ │ ├── indic-mobil-oddl.api.ts
│ │ │ │ ├── indic-perf-financiere-oddl.api.ts
│ │ │ │ ├── indic-plan-oddl.api.ts
│ │ │ │ ├── indic-planification.api.ts
│ │ │ │ └── indic-scoring-oddl.api.ts
│ │ │ ├── profil/
│ │ │ │ ├── get-all-role-register.api.ts
│ │ │ │ └── get-all-user.api.ts
│ │ │ └── region/
│ │ │ ├── get-commune-liste-trie.api.ts
│ │ │ ├── get-dbregion.api.ts
│ │ │ └── get-environement.api.ts
│ │ ├── helpers/
│ │ │ ├── apiClient.ts
│ │ │ ├── constant-api.ts
│ │ │ └── swrHelper.ts
│ │ └── types/
│ │ ├── all-role-register.type.ts
│ │ ├── all-user.type.ts
│ │ ├── dbcommune.type.ts
│ │ ├── dbregion.type.ts
│ │ ├── indic.type.ts
│ │ ├── login.type.ts
│ │ ├── odd-seize.type.ts
│ │ ├── oddO.type.ts
│ │ └── register.type.ts
│ └── middleware.ts
├── .env
├── .gitignore
├── README.md
├── components.json
├── eslint.config.mjs
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
