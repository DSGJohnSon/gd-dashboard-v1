import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateCompanyModal } from "../../store/use-create-workspace-company";
import CompaniesAddForm from "../forms/companies-add-form";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrent } from "@/features/auth/api/use-current";
import { LucideLoader } from "lucide-react";

function CreateCompanyModal() {
  const [open, setOpen] = useCreateCompanyModal();
  const { data: user, isLoading } = useCurrent();
  const queryClient = useQueryClient();

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleFormSubmit = () => {
    queryClient.invalidateQueries({
      queryKey: ["companyByUserId", user?.data.$id],
    });
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajoutez une entreprise</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point d&apos;ajouter une entreprise à votre compte.
            Vous serez considéré comme le propriétaire de cette entreprise.
          </DialogDescription>
        </DialogHeader>
        {isLoading || !user ? (
          <div className="flex justify-center items-center h-32">
            <LucideLoader className="animate-spin" />
          </div>
        ) : (
          <CompaniesAddForm
            onFormSubmit={handleFormSubmit}
            defaultUsersInCompany={[user.data.$id]}
            disableUsersSelect={true}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CreateCompanyModal;
