import { User } from "@/schema/user.schema";
import { ApiResponse } from ".";

// Response khi tạo user
export type CreateUserResponse = ApiResponse<{ user: User }>;

// Response khi lấy danh sách
export type FindAllUsersResponse = ApiResponse<{ users: User[] }>;

// Response khi lấy 1 user
export type FindOneUserResponse = ApiResponse<{ user: User }>;

// Response khi update user
export type UpdateUserResponse = ApiResponse<{ user: User }>;

// Response khi xoá user (cái này hơi khác vì bạn trả message)
export type RemoveUserResponse = {
  message: string;
};
