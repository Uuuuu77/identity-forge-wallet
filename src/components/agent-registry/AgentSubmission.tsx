
import { Button } from '@/components/ui/button';

interface AgentSubmissionProps {
  isSubmitting: boolean;
  isFormValid: boolean;
  onSubmit: () => void;
}

export const AgentSubmission = ({
  isSubmitting,
  isFormValid,
  onSubmit
}: AgentSubmissionProps) => {
  return (
    <div className="flex gap-4 pt-6 border-t border-white/10">
      <Button
        type="submit"
        disabled={isSubmitting || !isFormValid}
        onClick={onSubmit}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-xl text-lg flex-1 hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            Registering...
          </>
        ) : (
          <>
            <span>🚀</span>
            Register Agent
          </>
        )}
      </Button>
    </div>
  );
};
