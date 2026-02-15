import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";
import { toast } from "sonner";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onPrev: () => void;
}

const StepContact = ({ data, onChange, onPrev }: Props) => {
  const handleSubmit = () => {
    if (!data.nom || !data.email) {
      toast.error("Veuillez remplir au moins votre nom et votre email.");
      return;
    }
    toast.success("Merci ! Votre demande de devis a bien été envoyée.");
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-8">
        Vos coordonnées
      </h1>

      <div className="max-w-md mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={data.prenom}
            onChange={(e) => onChange({ prenom: e.target.value })}
            placeholder="Prénom"
            className="w-full px-4 py-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          />
          <input
            type="text"
            value={data.nom}
            onChange={(e) => onChange({ nom: e.target.value })}
            placeholder="Nom *"
            className="w-full px-4 py-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>
        <input
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="Email *"
          className="w-full px-4 py-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
        />
        <input
          type="tel"
          value={data.telephone}
          onChange={(e) => onChange({ telephone: e.target.value })}
          placeholder="Téléphone"
          className="w-full px-4 py-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
        />
        <input
          type="date"
          value={data.dateMariage}
          onChange={(e) => onChange({ dateMariage: e.target.value })}
          className="w-full px-4 py-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
        />
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          type="button"
          onClick={onPrev}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-8 py-3 bg-foreground text-background font-body font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Envoyer ma demande
        </button>
      </div>
    </div>
  );
};

export default StepContact;
