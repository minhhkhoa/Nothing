"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NewsSchema } from "@/schema/news.schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import TinyEditor from "../tinyCustomize";

export default function News() {
  const [showData, setShowData] = useState<z.infer<typeof NewsSchema>>();
  const form = useForm<z.infer<typeof NewsSchema>>({
    resolver: zodResolver(NewsSchema),
    defaultValues: {
      title: {
        vi: "",
      },
      description: {
        vi: "",
      },
      author: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof NewsSchema>) => {
    console.log(data);
    const translationResponse = await fetch(
      "http://localhost:9000/translation?module=news",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const translatedData = await translationResponse.json();
    console.log("Translated data:", translatedData);
    setShowData(translatedData);
  };

  console.log("show data: ", showData);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>News</CardTitle>
          <CardDescription>News description</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-8">
              <FormField
                control={form.control}
                name="title.vi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>title</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description.vi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <TinyEditor
                        field={field}
                        placeholder="Nhập mô tả tin tức..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit, (error) => {
              console.log("error: ", error);
            })}
          >
            Submit
          </Button>
        </CardFooter>
      </Card>

      {showData !== undefined && showData.description && (
        <>
          <div>
            <p>Đây là tiếng việt</p>
            <div
              dangerouslySetInnerHTML={{
                __html: showData?.description?.vi,
              }}
            />
          </div>
          <div className="my-10">
            <p>Đây là tiếng anh</p>
            <div
              dangerouslySetInnerHTML={{
                __html: showData?.description?.en,
              }}
            />
          </div>
        </>
      )}
    </>
  );
}
