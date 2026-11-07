import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export const useProjects = () => useQuery(orpc.portfolio.list.queryOptions({ staleTime: 30_000 }));
export const useProject = (id: string) =>
  useQuery(orpc.portfolio.get.queryOptions({ input: { id } }));
export const useAdminProjects = () => useQuery(orpc.portfolio.all.queryOptions({ retry: false }));
export function useSaveProject() {
  const qc = useQueryClient();
  return useMutation(
    orpc.portfolio.save.mutationOptions({
      onSuccess: () => qc.invalidateQueries({ queryKey: orpc.portfolio.key() }),
    }),
  );
}
export function useRemoveProject() {
  const qc = useQueryClient();
  return useMutation(
    orpc.portfolio.remove.mutationOptions({
      onSuccess: () => qc.invalidateQueries({ queryKey: orpc.portfolio.key() }),
    }),
  );
}
export function useToggleProject() {
  const qc = useQueryClient();
  const key = orpc.portfolio.all.queryOptions().queryKey;
  return useMutation(
    orpc.portfolio.toggle.mutationOptions({
      onMutate: async (input) => {
        await qc.cancelQueries({ queryKey: key });
        const previous = qc.getQueryData(key);
        qc.setQueryData(key, (old) =>
          old?.map((p) => (p.id === input.id ? { ...p, active: input.active } : p)),
        );
        return { previous };
      },
      onError: (_e, _i, ctx) => qc.setQueryData(key, ctx?.previous),
      onSettled: () => qc.invalidateQueries({ queryKey: orpc.portfolio.key() }),
    }),
  );
}
