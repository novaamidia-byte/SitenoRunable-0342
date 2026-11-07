import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";
export const useSettings = () => useQuery(orpc.settings.get.queryOptions({ staleTime: 30_000 }));
export function useSaveSettings() {
  const qc = useQueryClient();
  return useMutation(
    orpc.settings.save.mutationOptions({
      onSuccess: () => qc.invalidateQueries({ queryKey: orpc.settings.key() }),
    }),
  );
}
