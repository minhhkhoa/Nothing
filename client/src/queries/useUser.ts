import userApiRequest from "@/apiRequest/user";
import { UpdateUser } from "@/schema/user.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUserListQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: userApiRequest.getListUser,
  });
};

export const useGetUser = ({
  id,
  enabled,
}: {
  id: string;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => userApiRequest.getDetaiUser(id),
    enabled,
  });
};

export const useAddUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApiRequest.createUser,

    //- gọi api thanh cong thi refetch data
    onSuccess: () => {
      //- Lệnh dưới này báo cho React Query rằng dữ liệu của query với key ["users"] (tức là list user) đã cũ (stale) và cần được fetch lại từ server.
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateUser & { id: string }) =>
      userApiRequest.updateUser(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
        exact: true,
      });
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApiRequest.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export const useDeleteManyUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApiRequest.deleteManyUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

/*
- useQuery — dùng để fetch & cache dữ liệu (GET). Trả về data, isLoading, isError, refetch, ...
- useMutation — dùng để thay đổi dữ liệu (POST/PUT/PATCH/DELETE). Trả về mutate, mutateAsync, isLoading, error, ...
- queryKey — khoá cho cache; React Query dùng nó để lưu/lookup dữ liệu.
- queryFn / mutationFn — hàm thực tế gọi API (phải trả về Promise<T>).
*/
