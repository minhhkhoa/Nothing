"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateUser, CreateUserSchema } from "@/schema/user.schema";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { useAddUserMutation } from "@/queries/useUser";

export default function AddUser() {
  const [open, setOpen] = useState(false);

  const addUser = useAddUserMutation();

  const form = useForm<CreateUser>({
    //- dinh nghia form
    resolver: zodResolver(CreateUserSchema) as Resolver<CreateUser>, //- validate dữ liệu theo schema
    defaultValues: {
      name: "",
      email: "",
      age: 0,
    },
  });

  const reset = () => {
    form.reset();
    setOpen(false);
  };

  const onSubmit = async (data: CreateUser) => {
    if (addUser.isPending) return;

    try {
      const result = await addUser.mutateAsync(data);
      toast("Thông báo", {
        description: result.message,
      });
    } catch (error) {
      console.log("error create user: ", error);
    } finally {
      reset();
      setOpen(false);
    }
  };
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Tạo người dùng
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Tạo người dùng</DialogTitle>
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
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
