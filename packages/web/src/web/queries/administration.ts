import { useMutation, useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/api";
export const useInstallStatus = () => useQuery(orpc.administration.status.queryOptions());
export const useAdmin = () => useQuery(orpc.administration.me.queryOptions({ retry: false }));
export const useSetup = () => useMutation(orpc.administration.setup.mutationOptions());
