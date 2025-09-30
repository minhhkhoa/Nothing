/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ControllerRenderProps } from "react-hook-form";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

type TinyEditorProps = {
  field: ControllerRenderProps<any, any>;
  placeholder?: string;
};

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((m) => m.Editor),
  {
    ssr: false,
  }
);

export default function TinyEditor({ field, placeholder }: TinyEditorProps) {
  const editorRef = useRef<any>(null);

  const { theme } = useTheme();
  return (
    <Editor
      tinymceScriptSrc="tinymce/tinymce.min.js"
      licenseKey="gpl"
      onInit={(_evt, editor) => (editorRef.current = editor)}
      value={field.value}
      onEditorChange={(content) => field.onChange(content)}
      init={{
        height: 400,
        menubar: true,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | bold italic underline | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | removeformat | image media link | code",

        placeholder: placeholder,
        automatic_uploads: true,
        images_upload_url: "/api/upload", // API backend của bạn
        file_picker_types: "image",
        content_css: theme === "dark" ? "dark" : "default",
        skin: theme === "dark" ? "oxide-dark" : "oxide",

        file_picker_callback: (cb, _value, _meta) => {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.onchange = async () => {
            if (!input.files?.length) return;
            const file = input.files[0];
            const formData = new FormData();
            formData.append("fileUpload", file);

            try {
              const res = await fetch(
                "http://localhost:8000/api/v1/cloudinary/upload",
                {
                  method: "POST",
                  body: formData,
                }
              );

              // ép trả về JSON
              const json = await res.json();
              console.log("Upload response:", json);

              // nếu API trả về trong json.data
              const url = json.data;
              if (url) {
                cb(url, { alt: file.name });
              } else {
                console.error("No URL returned from server");
              }
            } catch (err) {
              console.error("Upload failed:", err);
            }
          };
          input.click();
        },
      }}
    />
  );
}
