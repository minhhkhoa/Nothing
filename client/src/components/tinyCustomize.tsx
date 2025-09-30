/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ControllerRenderProps } from "react-hook-form";
import { useRef, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleFilePicker = (
    cb: (value: string, meta?: Record<string, any> | undefined) => void,
    _value: string,
    _meta: Record<string, any>
  ) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    input.onchange = async function () {
      const file = (this as HTMLInputElement).files?.[0];
      if (!file) return;

      // disable nút Save
      const buttons = document.querySelectorAll<HTMLButtonElement>(
        ".tox-dialog__footer .tox-button"
      );
      const saveBtn = Array.from(buttons).find(
        (btn) => btn.textContent?.trim() === "Save"
      );
      saveBtn?.setAttribute("disabled", "true");

      try {
        // gọi API upload
        const formData = new FormData();
        formData.append("fileUpload", file);

        const res = await fetch(
          "http://localhost:8000/api/v1/cloudinary/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();

        console.log("data: ", data);
        // URL trả về từ API
        const url = data.data;

        // enable Save
        saveBtn?.removeAttribute("disabled");

        // đưa URL vào input Source
        cb(url, { title: file.name });
      } catch (e) {
        console.error("Upload error", e);
        saveBtn?.removeAttribute("disabled");
      }
    };

    input.click();
  };
  return (
    <div className="relative">
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
          images_upload_url: "/api/upload",
          file_picker_types: "image",
          content_css: theme === "dark" ? "dark" : "default",
          skin: theme === "dark" ? "oxide-dark" : "oxide",

          file_picker_callback: handleFilePicker,
        }}
      />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
