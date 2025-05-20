import { MainNav } from "@/components/Navbar"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <div className="flex-1 container py-8 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="font-pixel text-2xl md:text-3xl mb-2">{"CONDITIONS GÉNÉRALES D'UTILISATION"}</h1>
          <p className="font-pixel text-xs text-muted-foreground">{"Dernière mise à jour : 08/05/2025"}</p>
        </div>

        <div className="space-y-6">
          <section className="space-y-2">
            <h2 className="font-pixel text-xl text-game-blue">{"1. ACCEPTATION DES CONDITIONS"}</h2>
            <p className="text-sm">
              {"En accédant et en utilisant la plateforme FT_TRANSCENDANCE, vous acceptez d'être lié par ces Conditions" +
              " Générales d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service."}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-pixel text-xl text-game-blue">{"2. DESCRIPTION DU SERVICE"}</h2>
            <p className="text-sm">
              {"FT_TRANSCENDANCE est une plateforme de jeux rétro en ligne permettant aux utilisateurs de jouer à des jeux" +
              " classiques, de suivre leurs statistiques, de personnaliser leur expérience et d'interagir avec d'autres" +
              " joueurs."}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-pixel text-xl text-game-blue">{"3. INSCRIPTION ET COMPTE"}</h2>
            <p className="text-sm">
              {"Pour utiliser pleinement notre service, vous devez créer un compte. Vous êtes responsable de maintenir la" +
              " confidentialité de vos informations de compte et de toutes les activités qui se produisent sous votre" +
              " compte."}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-pixel text-xl text-game-blue">{"4. RÈGLES DE CONDUITE"}</h2>
            <p className="text-sm">
              {"Les utilisateurs doivent respecter les autres membres de la communauté. Tout comportement abusif," +
              " harcèlement, ou contenu inapproprié pourra entraîner la suspension ou la suppression du compte."}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-pixel text-xl text-game-blue">{"5. PROPRIÉTÉ INTELLECTUELLE"}</h2>
            <p className="text-sm">
              {"Tous les jeux, graphismes, logos et contenus présents sur FT_TRANSCENDANCE sont protégés par des droits" +
              " d'auteur. Vous n'êtes pas autorisé à les reproduire ou les utiliser sans autorisation explicite."}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-pixel text-xl text-game-blue">{"6. MONNAIE VIRTUELLE"}</h2>
            <p className="text-sm">
              {"Les pièces et autres monnaies virtuelles disponibles sur la plateforme n'ont aucune valeur monétaire" +
              " réelle et ne peuvent être échangées contre de l'argent réel. Elles sont uniquement destinées à être" +
              " utilisées au sein de la plateforme."}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-pixel text-xl text-game-blue">{"7. MODIFICATIONS DES CONDITIONS"}</h2>
            <p className="text-sm">
              {"Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés" +
              " des changements importants, et la poursuite de l'utilisation du service après ces modifications constitue" +
              " votre acceptation des nouvelles conditions."}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-pixel text-xl text-game-blue">{"8. CONTACT"}</h2>
            <p className="text-sm">
              {"Pour toute question concernant ces conditions, veuillez nous contacter à l'adresse suivante :" +
              " ft_transcendance"}
            </p>
          </section>
        </div>
      </div>

      <footer className="border-t border-muted py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-pixel text-sm bg-linear-to-r from-game-blue via-game-orange to-game-red bg-clip-text text-transparent animate-pixelate">
                {"FT_TRANSCENDANCE"}
              </span>
            </div>
            <p className="font-pixel text-xs text-muted-foreground">{"© 2025 FT_TRANSCENDANCE. TOUS DROITS RÉSERVÉS."}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
