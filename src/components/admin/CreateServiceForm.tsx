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

type Props = {
  initialData?: FormDataType;
};

export default function CreateServiceForm({
  initialData,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState<Record<string, string>>(
      {
        title: "",
        shortDescription: "",
        description: "",
        tagline: "",
        category: "",
        includes: "",
        file: "",
      },
    );

  const [form, setForm] =
    useState<FormDataType>(
      initialData || {
        title: "",

        shortDescription: "",

        description: "",

        tagline: "",

        category: "",

        includes: [""],

        file: null,
      },
    );

  const getFieldErrors = (
    values: FormDataType,
  ): Record<string, string> => {

    const result =
      createServiceSchema.safeParse(
        values,
      );

    if (result.success) {

      return {
        title: "",
        shortDescription: "",
        description: "",
        tagline: "",
        category: "",
        includes: "",
        file: "",
      };
    }

    const formatted =
      result.error.format();

    return {
      title:
        formatted.title?._errors?.[0] ??
        "",

      shortDescription:
        formatted
          .shortDescription
          ?._errors?.[0] ??
        "",

      description:
        formatted
          .description
          ?._errors?.[0] ??
        "",

      tagline:
        formatted
          .tagline
          ?._errors?.[0] ??
        "",

      category:
        formatted
          .category
          ?._errors?.[0] ??
        "",

      includes:
        formatted
          .includes
          ?._errors?.[0] ??
        "",

      file:
        formatted.file
          ?._errors?.[0] ??
        "",
    };
  };

  const validateField = (
    field: keyof Record<
      string,
      string
    >,
    values: FormDataType,
  ) => {

    const fieldErrors =
      getFieldErrors(values);

    setErrors(fieldErrors);

    const errorMessage =
      fieldErrors[field];

    if (!errorMessage) return;

    switch (field) {

      case "title":

        toast.error(
          `Título: ${errorMessage}`,
          {
            id: "title-error",
          },
        );

        break;

      case "shortDescription":

        toast.error(
          `Descripción corta: ${errorMessage}`,
          {
            id: "short-description-error",
          },
        );

        break;

      case "description":

        toast.error(
          `Descripción: ${errorMessage}`,
          {
            id: "description-error",
          },
        );

        break;

      case "tagline":

        toast.error(
          `Tagline: ${errorMessage}`,
          {
            id: "tagline-error",
          },
        );

        break;

      case "category":

        toast.error(
          `Categoría: ${errorMessage}`,
          {
            id: "category-error",
          },
        );

        break;

      case "includes":

        toast.error(
          `Includes: ${errorMessage}`,
          {
            id: "includes-error",
          },
        );

        break;

      case "file":

        toast.error(
          `Imagen: ${errorMessage}`,
          {
            id: "file-error",
          },
        );

        break;
    }
  };

  const handleChange = (
    field: keyof FormDataType,
    value: any,
  ) => {

    const updatedForm = {
      ...form,

      [field]: value,
    };

    setForm(updatedForm);

    validateField(
      field,
      updatedForm,
    );
  };

  const handleIncludeChange = (
    index: number,
    value: string,
  ) => {

    const updatedIncludes = [
      ...form.includes,
    ];

    updatedIncludes[index] = value;

    const updatedForm = {
      ...form,

      includes: updatedIncludes,
    };

    setForm(updatedForm);

    validateField(
      "includes",
      updatedForm,
    );
  };

  const addInclude = () => {

    setForm({
      ...form,

      includes: [
        ...form.includes,
        "",
      ],
    });
  };

  const removeInclude = (
    index: number,
  ) => {

    const updatedForm = {
      ...form,

      includes: form.includes.filter(
        (_, i) => i !== index,
      ),
    };

    setForm(updatedForm);

    validateField(
      "includes",
      updatedForm,
    );
  };

  const handleSubmit = async () => {

    const validation =
      createServiceSchema.safeParse(
        form,
      );

    if (!validation.success) {

      const fieldErrors =
        getFieldErrors(form);

      setErrors(fieldErrors);

      const firstError =
        Object.values(
          fieldErrors,
        ).find(Boolean);

      toast.error(
        firstError ||
          "Revisá los campos del formulario",
      );

      return;
    }

    try {

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "title",
        form.title,
      );

      formData.append(
        "shortDescription",
        form.shortDescription,
      );

      formData.append(
        "description",
        form.description,
      );

      formData.append(
        "tagline",
        form.tagline,
      );

      formData.append(
        "category",
        form.category,
      );

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

      toast.success(
        "Servicio creado correctamente",
      );

      setForm({
        title: "",

        shortDescription: "",

        description: "",

        tagline: "",

        category: "",

        includes: [""],

        file: null,
      });

      setErrors({
        title: "",
        shortDescription: "",
        description: "",
        tagline: "",
        category: "",
        includes: "",
        file: "",
      });

    } catch (error) {

      console.error(
        "ERROR BACK:",
        JSON.stringify(
          error,
          null,
          2,
        ),
      );

      toast.error(
        "Error creando servicio",
      );

    } finally {

      setLoading(false);
    }
  };

  const inputClass = (
    field: string,
  ) =>
    `${
      errors[field]
        ? "border-red-500"
        : "border-white/10"
    }`;

  return (
    <div className="max-w-xl space-y-5">

      <div className="space-y-2">

        <Input
          placeholder="Título"
          value={form.title}
          onChange={(e) =>
            handleChange(
              "title",
              e.target.value,
            )
          }
          className={inputClass(
            "title",
          )}
        />

        {errors.title && (
          <p className="text-sm text-red-400">
            {errors.title}
          </p>
        )}

      </div>

      <div className="space-y-2">

        <Input
          placeholder="Descripción corta"
          value={
            form.shortDescription
          }
          onChange={(e) =>
            handleChange(
              "shortDescription",
              e.target.value,
            )
          }
          className={inputClass(
            "shortDescription",
          )}
        />

        {errors.shortDescription && (
          <p className="text-sm text-red-400">
            {
              errors.shortDescription
            }
          </p>
        )}

      </div>

      <div className="space-y-2">

        <Input
          placeholder="Tagline"
          value={form.tagline}
          onChange={(e) =>
            handleChange(
              "tagline",
              e.target.value,
            )
          }
          className={inputClass(
            "tagline",
          )}
        />

        {errors.tagline && (
          <p className="text-sm text-red-400">
            {errors.tagline}
          </p>
        )}

      </div>

      <div className="space-y-2">

        <Input
          placeholder="Categoría"
          value={form.category}
          onChange={(e) =>
            handleChange(
              "category",
              e.target.value,
            )
          }
          className={inputClass(
            "category",
          )}
        />

        {errors.category && (
          <p className="text-sm text-red-400">
            {errors.category}
          </p>
        )}

      </div>

      <div className="space-y-2">

        <textarea
          placeholder="Descripción completa"
          value={form.description}
          onChange={(e) =>
            handleChange(
              "description",
              e.target.value,
            )
          }
          className={`
            w-full min-h-35 rounded-xl border bg-white/5 px-4 py-3 text-white outline-none

            ${
              errors.description
                ? "border-red-500"
                : "border-white/10"
            }
          `}
        />

        {errors.description && (
          <p className="text-sm text-red-400">
            {errors.description}
          </p>
        )}

      </div>

      <div className="space-y-3">

        <p className="text-sm text-gray-400">
          Incluye
        </p>

        {form.includes.map(
          (item, index) => (

            <div
              key={index}
              className="flex gap-2"
            >

              <Input
                placeholder="Ej: Diagnóstico de equipo"
                value={item}
                onChange={(e) =>
                  handleIncludeChange(
                    index,
                    e.target.value,
                  )
                }
                className={inputClass(
                  "includes",
                )}
              />

              <button
                type="button"
                onClick={() =>
                  removeInclude(
                    index,
                  )
                }
                className="px-4 rounded-lg bg-red-500/20 text-red-400 cursor-pointer"
              >
                -
              </button>

            </div>
          ),
        )}

        {errors.includes && (
          <p className="text-sm text-red-400">
            {errors.includes}
          </p>
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
            handleChange(
              "file",
              e.target.files?.[0] ||
                null,
            )
          }
          className={`
            block w-full text-sm text-gray-300 rounded-xl border p-3 bg-white/5

            ${
              errors.file
                ? "border-red-500"
                : "border-white/10"
            }
          `}
        />

        {errors.file && (
          <p className="text-sm text-red-400">
            {errors.file}
          </p>
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