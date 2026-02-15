import { QuoteData } from "../types";
import NavigationButtons from "../NavigationButtons";
import { toast } from "sonner";
import { MapPin } from "lucide-react";

interface Props {
  data: QuoteData;
  onChange: (updates: Partial<QuoteData>) => void;
  onPrev: () => void;
}

const StepContact = ({ data, onChange, onPrev }: Props) => {
  const handleNext = () => {
    if (!data.nom || !data.email) {
      toast.error("Veuillez remplir au moins le nom et l'email.");
      return;
    }
    toast.success("Merci ! Votre demande de devis a bien été envoyée.");
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-10">
        Vos coordonnees pour recevoir le devis et réserver
      </h1>

      <div className="max-w-xl mx-auto space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={data.prenom}
            onChange={(e) => onChange({ prenom: e.target.value })}
            placeholder="Nom & prénom de la mariée"
            className="w-full px-4 py-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          />
          <input
            type="text"
            value={data.nom}
            onChange={(e) => onChange({ nom: e.target.value })}
            placeholder="Nom & prénom du marié"
            className="w-full px-4 py-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="tel"
            value={data.telephone}
            onChange={(e) => onChange({ telephone: e.target.value })}
            placeholder="Téléphone"
            className="w-full px-4 py-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          />
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="Email"
            className="w-full px-4 py-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={data.dateMariage}
            onChange={(e) => onChange({ dateMariage: e.target.value })}
            placeholder="Adresse"
            className="w-full pl-10 pr-4 py-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>
      </div>

      <NavigationButtons onPrev={onPrev} onNext={handleNext} />
    </div>
  );
};

export default StepContact;
