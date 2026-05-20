"use client";

import { useState } from "react";
import { toast } from "sonner";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { createTraining } from "@/services/training.service";
import { createServiceSchema } from "@/validations/createServiceValidator";

type FormDataType = {
  title: string;
  shortDescription: string;
  description: string;
  tagline: string;
  category: string;
  includes: string[];
  file: File | null;
};

export default function CreateServiceForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormDataType>({
    title: "",
    shortDescription: "",
    description: "",
    tagline: "",
    category: "",
    includes: [""],
    file: null,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({
    title: false,
    shortDescription: false,
    description: false,
    tagline: false,
    category: false,
    includes: false,
    file: false,
  });

  const [submitAttempted, setSubmitAttempted] = useState(false);

  const getErrors = () => {
  const result = createServiceSchema.safeParse(form);

  if (result.success) return {};

  const f = result.error.format();

  return {
    title: f.title?._errors?.[0],
    shortDescription: f.shortDescription?._errors?.[0],
    description: f.description?._errors?.[0],
    tagline: f.tagline?._errors?.[0],
    category: f.category?._errors?.[0],
    includes: f.includes?._errors?.[0],
    file: f.file?._errors?.[0],
  };
};

const errors = getErrors();

 const showError = (field: keyof FormDataType) => {
  if (!submitAttempted && !touched[field]) return "";
  return errors[field];
};

  const inputClass = (field: keyof FormDataType) =>
    showError(field)
      ? "border-red-500"
      : "border-white/10";

  const handleChange = (field: keyof FormDataType, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBlur = (field: keyof FormDataType) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleIncludeChange = (index: number, value: string) => {
    const updated = [...form.includes];
    updated[index] = value;

    setForm((prev) => ({
      ...prev,
      includes: updated,
    }));
  };

  const addInclude = () => {
    setForm((prev) => ({
      ...prev,
      includes: [...prev.includes, ""],
    }));
  };

  const removeInclude = (index: number) => {
    setForm((prev) => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index),
    }));
  };

const handleSubmit = async () => {
  setTouched({
  title: true,
  shortDescription: true,
  description: true,
  tagline: true,
  category: true,
  includes: true,
  file: true,
});

setSubmitAttempted(true);

  const result = createServiceSchema.safeParse(form);

  if (!result.success) {
    setTouched({
      title: true,
      shortDescription: true,
      description: true,
      tagline: true,
      category: true,
      includes: true,
      file: true,
    });

    toast.warning("Debes completar todos los campos");
    return;
  }

    try {

      setLoading(true);

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("shortDescription", form.shortDescription);
    formData.append("description", form.description);
    formData.append("tagline", form.tagline);
    formData.append("category", form.category);

      form.includes.forEach(
        (item) => {

          formData.append(
            "includes",
            item,
          );
        },
      );

      formData.append(
        "file",
        form.file!,
      );

      await createTraining(
        formData,
      );

    toast.success("Servicio creado correctamente");

    setForm({
      title: "",
      shortDescription: "",
      description: "",
      tagline: "",
      category: "",
      includes: [""],
      file: null,
    });

    setTouched({
      title: false,
      shortDescription: false,
      description: false,
      tagline: false,
      category: false,
      includes: false,
      file: false,
    });

    setSubmitAttempted(false);

  } catch (error) {
    toast.error("Error al guardar el servicio");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-xl space-y-5">

      <div className="space-y-2">
        <Input
          placeholder="Título"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          onBlur={() => handleBlur("title")}
          className={inputClass("title")}
        />
        {showError("title") && (
          <p className="text-sm text-red-400">{showError("title")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          placeholder="Descripción corta"
          value={form.shortDescription}
          onChange={(e) => handleChange("shortDescription", e.target.value)}
          onBlur={() => handleBlur("shortDescription")}
          className={inputClass("shortDescription")}
        />
        {showError("shortDescription") && (
          <p className="text-sm text-red-400">{showError("shortDescription")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          placeholder="Tagline"
          value={form.tagline}
          onChange={(e) => handleChange("tagline", e.target.value)}
          onBlur={() => handleBlur("tagline")}
          className={inputClass("tagline")}
        />
        {showError("tagline") && (
          <p className="text-sm text-red-400">{showError("tagline")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          placeholder="Categoría"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
          onBlur={() => handleBlur("category")}
          className={inputClass("category")}
        />
        {showError("category") && (
          <p className="text-sm text-red-400">{showError("category")}</p>
        )}
      </div>

      <div className="space-y-2">
        <textarea
          placeholder="Descripción completa"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          onBlur={() => handleBlur("description")}
          className={`w-full min-h-35 rounded-xl border bg-white/5 px-4 py-3 text-white outline-none ${inputClass("description")}`}
        />
        {showError("description") && (
          <p className="text-sm text-red-400">{showError("description")}</p>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-400">Incluye</p>

        {form.includes.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Ej: Diagnóstico de equipo"
              value={item}
              onChange={(e) =>
                handleIncludeChange(index, e.target.value)
              }
              className={inputClass("includes")}
            />

            <button
              type="button"
              onClick={() => removeInclude(index)}
              className="px-4 rounded-lg bg-red-500/20 text-red-400 cursor-pointer"
            >
              -
            </button>
          </div>
        ))}

        {showError("includes") && (
          <p className="text-sm text-red-400">{showError("includes")}</p>
        )}

        <button
          type="button"
          onClick={addInclude}
          className="text-sm text-[#C7962D] cursor-pointer"
        >
          + Agregar item
        </button>
      </div>

      <div className="space-y-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            handleChange("file", e.target.files?.[0] || null)
          }
          onBlur={() => handleBlur("file")}
          className={`block w-full text-sm text-gray-300 rounded-xl border p-3 bg-white/5 ${inputClass("file")}`}
        />

        {showError("file") && (
          <p className="text-sm text-red-400">{showError("file")}</p>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        className="cursor-pointer"
      >
        {loading
          ? "Guardando..."
          : "Guardar servicio"}
      </Button>

    </div>
  );
}