import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { authMessages } from "../messages";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.auth.login)["$post"]>;
type RequestType = InferRequestType<
  (typeof client.api.auth.login)["$post"]
>["json"];

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.auth.login["$post"]({ json });
      return await response.json();
    },
    onSuccess: (response) => {
      if (response.success) {
        const traductedSucessMessage = authMessages.find(
          (item) => item.code === response.message
        );
        if (!traductedSucessMessage) {
          toast.success(response.message); //afficher le message par défaut
        } else {
          toast.success(traductedSucessMessage.fr); //afficher le message de succès personnalisé
        }
      } else {
        const traductedError = authMessages.find(
          (item) => item.code === response.message
        );
        if (!traductedError) {
          toast.error(response.message); //afficher le message d'erreur par défaut
        } else {
          toast.error(traductedError.fr); //afficher le message d'erreur personnalisé
        }
      }
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: (error: Error) => {
      //Récupérer le message d'erreur personnalisé
      const traductedError = authMessages.find(
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
