"use client";

import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Resolver } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpdateUser, UpdateUserSchema } from "@/schema/user.schema";
import { useGetUser, useUpdateUserMutation } from "@/queries/useUser";
import userApiRequest from "@/apiRequest/user";
import { toast } from "sonner";

export default function EditUser({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: string | undefined;
  setId: (value: string | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const reset = () => {
    setId(undefined);
  };
  const { data } = useGetUser({ id: id as string, enabled: Boolean(id) });
  const editUserMutation = useUpdateUserMutation();

  const form = useForm<UpdateUser>({
    resolver: zodResolver(UpdateUserSchema) as Resolver<UpdateUser>,
    defaultValues: {
      name: "",
      email: "",
      age: 0,
    },
  });

  const onSubmit = async (data: UpdateUser) => {
    if (editUserMutation.isPending) return;
    try {
      const result = await editUserMutation.mutateAsync({
        id: id as string,
        ...data,
      });

      toast("Thông báo", {
        description: result.message,
      });

      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      console.log("error edit user: ", error);
    } finally {
      reset();
    }
  };

  useEffect(() => {
    if (data) {
      const { age, email, name } = data?.data?.user;
      form.reset({
        name,
        email,
        age,
      });
    }
  }, [data, form]);
  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          reset();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Sửa người dùng</DialogTitle>
          <DialogDescription>
            Các trường tên, email, mật khẩu là bắt buộc
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="add-employee-form"
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log("error addEmployee: ", e);
            })}
            onReset={reset}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="name">Tên</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="name"
                          className="w-full"
                          {...field}
                          placeholder="Nhập tên"
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="email">Email</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="email"
                          className="w-full"
                          {...field}
                          placeholder="example@example"
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="age">Tuổi</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          placeholder="Nhập tuổi"
                          id="age"
                          className="w-full"
                          type="number"
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="add-employee-form">
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
