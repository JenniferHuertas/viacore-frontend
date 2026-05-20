"use client";

import {
  useEffect,
  useState,
  type SubmitEvent,
} from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import AdminLayout from "@/components/admin/AdminLayout";

import {
  getTrainingById,
  updateTraining,
} from "@/services/training.service";

import { serviceSchema } from "@/validations/serviceValidator";

type Props = {
  id: string;
};

type ServiceFormValues = {
  title: string;
  shortDescription: string;
  description: string;
  tagline: string;
  category: string;
  includes: string[];
  file: File | null;
};

export default function EditServiceView({
  id,
}: Props) {

  const router =
    useRouter();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [
    shortDescription,
    setShortDescription,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [tagline, setTagline] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [includes, setIncludes] =
    useState<string[]>([]);

  const [includeInput, setIncludeInput] =
    useState("");

  const [file, setFile] =
    useState<File | null>(null);

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

  const getCurrentValues =
    (): ServiceFormValues => ({
      title,
      shortDescription,
      description,
      tagline,
      category,
      includes,
      file,
    });

  const getFieldErrors = (
    values: ServiceFormValues,
  ): Record<string, string> => {

    const result =
      serviceSchema.safeParse(
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
    values: ServiceFormValues,
  ) => {

    const fieldErrors =
      getFieldErrors(values);

    setErrors(fieldErrors);

    if (fieldErrors[field]) {

      toast.error(
        fieldErrors[field],
        {
          id: `service-${field}`,
        },
      );
    }
  };

  useEffect(() => {

    const fetchService =
      async () => {

        try {

          const data =
            await getTrainingById(
              id,
            );

          setTitle(
            data.title || "",
          );

          setShortDescription(
            data.shortDescription ||
              "",
          );

          setDescription(
            data.description ||
              "",
          );

          setTagline(
            data.tagline || "",
          );

          setCategory(
            data.category || "",
          );

          setIncludes(
            data.includes || [],
          );

        } catch (error) {

          console.error(error);

          toast.error(
            "Error cargando servicio",
          );

        } finally {

          setLoading(false);

        }
      };

    fetchService();

  }, [id]);

  const handleAddInclude =
    () => {

      if (
        !includeInput.trim()
      ) {

        toast.error(
          "Debes escribir un include",
        );

        return;
      }

      const updatedIncludes =
        [
          ...includes,
          includeInput.trim(),
        ];

      setIncludes(
        updatedIncludes,
      );

      validateField(
        "includes",
        {
          ...getCurrentValues(),
          includes:
            updatedIncludes,
        },
      );

      setIncludeInput("");
    };

  const handleRemoveInclude =
    (
      index: number,
    ) => {

      const updatedIncludes =
        includes.filter(
          (_, i) =>
            i !== index,
        );

      setIncludes(
        updatedIncludes,
      );

      validateField(
        "includes",
        {
          ...getCurrentValues(),
          includes:
            updatedIncludes,
        },
      );
    };

  const handleSubmit = async (
    e: SubmitEvent<HTMLFormElement>,
  ) => {

    e.preventDefault();

    const values =
      getCurrentValues();

    const validation =
      serviceSchema.safeParse(
        values,
      );

    if (!validation.success) {

      const fieldErrors =
        getFieldErrors(
          values,
        );

      setErrors(
        fieldErrors,
      );

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

      setSaving(true);

      const token =
        localStorage.getItem(
          "token",
        );

      if (!token) {

        toast.warning(
          "Debes iniciar sesión",
        );

        return;
      }

      const formData =
        new FormData();

      formData.append(
        "title",
        title,
      );

      formData.append(
        "shortDescription",
        shortDescription,
      );

      formData.append(
        "description",
        description,
      );

      formData.append(
        "tagline",
        tagline,
      );

      formData.append(
        "category",
        category,
      );

      includes.forEach(
        (include) => {

          formData.append(
            "includes",
            include,
          );

        },
      );

      if (file) {

        formData.append(
          "file",
          file,
        );
      }

      await updateTraining(
        id,
        formData,
        token,
      );

      toast.success(
        "Servicio actualizado correctamente",
      );

      router.push(
        "/admin/services",
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Error actualizando servicio",
      );

    } finally {

      setSaving(false);

    }
  };

  const inputClass = (
    field: string,
  ) =>
    `w-full rounded-xl border bg-black p-3 text-white outline-none focus:border-[#C7962D] ${
      errors[field]
        ? "border-red-500"
        : "border-white/10"
    }`;

  if (loading) {

    return (
      <AdminLayout>

        <div className="text-gray-400">
          Cargando servicio...
        </div>

      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <div className="space-y-8">

        <div>

          <h1 className="text-3xl font-semibold text-white">
            Editar servicio
          </h1>

          <div className="h-0.5 w-16 bg-[#C7962D] mt-3" />

          <p className="text-gray-400 mt-4">
            Modificá la información del servicio.
          </p>

        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-6 rounded-2xl border border-white/10 bg-[#0B0D0F] p-8"
        >

          <div className="space-y-2">

            <label className="text-sm text-gray-300">
              Título
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => {

                const value =
                  e.target.value;

                setTitle(value);

                validateField(
                  "title",
                  {
                    ...getCurrentValues(),
                    title: value,
                  },
                );
              }}
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

            <label className="text-sm text-gray-300">
              Descripción corta
            </label>

            <input
              type="text"
              value={
                shortDescription
              }
              onChange={(e) => {

                const value =
                  e.target.value;

                setShortDescription(
                  value,
                );

                validateField(
                  "shortDescription",
                  {
                    ...getCurrentValues(),
                    shortDescription:
                      value,
                  },
                );
              }}
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

            <label className="text-sm text-gray-300">
              Descripción
            </label>

            <textarea
              value={description}
              onChange={(e) => {

                const value =
                  e.target.value;

                setDescription(
                  value,
                );

                validateField(
                  "description",
                  {
                    ...getCurrentValues(),
                    description:
                      value,
                  },
                );
              }}
              className={`${inputClass(
                "description",
              )} min-h-35`}
            />

            {errors.description && (
              <p className="text-sm text-red-400">
                {errors.description}
              </p>
            )}

          </div>

          <div className="space-y-2">

            <label className="text-sm text-gray-300">
              Tagline
            </label>

            <input
              type="text"
              value={tagline}
              onChange={(e) => {

                const value =
                  e.target.value;

                setTagline(
                  value,
                );

                validateField(
                  "tagline",
                  {
                    ...getCurrentValues(),
                    tagline:
                      value,
                  },
                );
              }}
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

            <label className="text-sm text-gray-300">
              Categoría
            </label>

            <input
              type="text"
              value={category}
              onChange={(e) => {

                const value =
                  e.target.value;

                setCategory(
                  value,
                );

                validateField(
                  "category",
                  {
                    ...getCurrentValues(),
                    category:
                      value,
                  },
                );
              }}
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

          <div className="space-y-3">

            <label className="text-sm text-gray-300">
              Includes
            </label>

            <div className="flex gap-2">

              <input
                type="text"
                value={
                  includeInput
                }
                onChange={(e) =>
                  setIncludeInput(
                    e.target.value,
                  )
                }
                className={inputClass(
                  "includes",
                )}
              />

              <button
                type="button"
                onClick={
                  handleAddInclude
                }
                className="rounded-xl bg-[#C7962D] px-4 text-black font-semibold"
              >
                Agregar
              </button>

            </div>

            {errors.includes && (
              <p className="text-sm text-red-400">
                {errors.includes}
              </p>
            )}

            <div className="flex flex-wrap gap-2">

              {includes.map(
                (
                  item,
                  index,
                ) => (

                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white"
                  >

                    {item}

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveInclude(
                          index,
                        )
                      }
                      className="text-red-400 cursor-pointer" 
                    >
                      ×
                    </button>

                  </div>

                ),
              )}

            </div>

          </div>

          <div className="space-y-2">

            <label className="text-sm text-gray-300">
              Nueva imagen
            </label>

            <input
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              onChange={(e) => {

                const selectedFile =
                  e.target.files?.[0] ??
                  null;

                setFile(
                  selectedFile,
                );

                validateField(
                  "file",
                  {
                    ...getCurrentValues(),
                    file:
                      selectedFile,
                  },
                );
              }}
              className={inputClass(
                "file",
              )}
            />

            {errors.file && (
              <p className="text-sm text-red-400">
                {errors.file}
              </p>
            )}

          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#C7962D] px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {saving
              ? "Guardando..."
              : "Guardar cambios"}
          </button>

        </form>

      </div>

    </AdminLayout>
  );
}