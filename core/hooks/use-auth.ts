import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/core/lib/rpc";

import { useRouter } from "next/navigation";
import { QueryKeyString } from "@/core/lib/constants";
import { toast } from "@/core/components/global/custom-toast";

type ResponseType = InferResponseType<
  (typeof client.api.auth.login)["$post"],
  200
>;
type RequestType = InferRequestType<(typeof client.api.auth.login)["$post"]>;

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login["$post"]({ json });
      const result = await response.json();

      if ("error" in result) {
        throw new Error(result.error);
      }
      if (!("data" in result)) {
        throw new Error("Invalid response from server");
      }
      return result as { data: { url: string; success: true } };
    },
    onSuccess: ({ data }) => {
      toast.success({
        message: "Bienvenu",
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.current] });

      router.push(`${data.url || "/"}`);
    },
    onError: () => {
      toast.error({ message: "Veuillez s vérifier vos identifiants !" });
    },
  });

  return mutation;
};

type ResponseLogout = InferResponseType<
  (typeof client.api.auth.logout)["$post"],
  200
>;
type RequestLogout = InferRequestType<(typeof client.api.auth.logout)["$post"]>;

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseLogout, Error, RequestLogout>({
    mutationFn: async () => {
      const response = await client.api.auth.logout["$post"]();
      const result = await response.json();

      return result;
    },
    onSuccess: () => {
      toast.success({
        message: "Vous êtes déconnecté",
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.current] });
      router.refresh();
    },
    onError: ({ message }) => {
      router.refresh();
      toast.error({
        message: message,
      });
    },
  });

  return mutation;
};

type ResponseTypeResetPassword = InferResponseType<
  (typeof client.api.auth.resetPassword)["$post"],
  200
>;
type RequestTypeResetPassword = InferRequestType<
  (typeof client.api.auth.resetPassword)["$post"]
>;

export const useResetPassword = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseTypeResetPassword,
    Error,
    RequestTypeResetPassword
  >({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.resetPassword["$post"]({
        json,
      });
      const result = await response.json();

      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: ({ data }) => {
      toast.success({
        message: "Mot de passe a été réinitialisé",
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.current] });
    },
    onError: ({ message }) => {
      toast.error({
        message: "Échec de la connexion " + message,
      });
    },
  });

  return mutation;
};





type ResSend = InferResponseType<
  (typeof client.api.auth.sentResetPassword)["$post"],
  200
>;
type ReqSend = InferRequestType<
  (typeof client.api.auth.sentResetPassword)["$post"]
>;

export const useSendResetPassword = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResSend,
    Error,
    ReqSend
  >({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.sentResetPassword["$post"]({
        json,
      });
      const result = await response.json();

      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: ({ data }) => {
      toast.success({
        message: "Mot de passe a été réinitialisé",
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeyString.current] });
    },
    onError: ({ message }) => {
      toast.error({
        message: "Échec de la connexion " + message,
      });
    },
  });

  return mutation;
};
