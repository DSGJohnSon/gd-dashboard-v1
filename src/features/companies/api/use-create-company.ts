import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { companiesMessages } from "../messages";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.companies.create)["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.companies.create)["$post"]
>["json"];

export const useCreateCompany = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.companies.create["$post"]({ json });
      return await response.json();
    },
    onSuccess: (response) => {
      if (response.success) {
        const traductedSucessMessage = companiesMessages.find(
          (item) => item.code === response.message
        );
        if (!traductedSucessMessage) {
          toast.success(response.message); //afficher le message par défaut
        } else {
          toast.success(traductedSucessMessage.fr); //afficher le message de succès personnalisé
        }
      } else {
        const traductedError = companiesMessages.find(
          (item) => item.code === response.message
        );
        if (!traductedError) {
          toast.error(response.message); //afficher le message d'erreur par défaut
        } else {
          toast.error(traductedError.fr); //afficher le message d'erreur personnalisé
        }
      }
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (error: Error) => {
      //Récupérer le message d'erreur personnalisé
      const traductedError = companiesMessages.find(
        (item) => item.code === error.message
      );
      if (!traductedError) {
        toast.error(error.message); //afficher le message d'erreur par défaut
      } else {
        toast.error(traductedError.fr); //afficher le message d'erreur personnalisé
      }
    },
  });

  return mutation;
};
