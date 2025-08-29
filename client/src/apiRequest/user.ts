import { http } from "@/lib/http";
import { CreateUser, UpdateUser } from "@/schema/user.schema";
import {
  CreateUserResponse,
  FindAllUsersResponse,
  FindOneUserResponse,
  RemoveUserResponse,
  UpdateUserResponse,
} from "@/type/User";

const userApiRequest = {
  getListUser: () => http.get<FindAllUsersResponse>("users"),
  getDetaiUser: (id: string) => http.get<FindOneUserResponse>(`users/${id}`),
  createUser: (body: CreateUser) =>
    http.post<CreateUserResponse>("users", body),
  updateUser: (id: string, body: UpdateUser) =>
    http.patch<UpdateUserResponse>(`users/${id}`, body),
  deleteUser: (id: string) => http.delete<RemoveUserResponse>(`users/${id}`),
  deleteManyUser: (body: number[]) =>
    http.delete<RemoveUserResponse>(`users/deletemany`, body),
};

export default userApiRequest;
