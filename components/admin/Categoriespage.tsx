"use client";
import { useState } from "react";
import {
  FolderPlus,
  Tag,
  AlertCircle,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";
import {
  useGetCategory,
  useCreateCategory,
  usePatchCategory,
  useDeleteCategory,
} from "@/hooks/useDashboard";
import { toast } from "@/hooks/use-toast";
import { ErrorResponse } from "@/type/type";
import { AxiosError } from "axios";

export default function CategoriesPage() {
  const [name_en, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editNameAr, setEditNameAr] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);

  // Per-item patching state (replaces global `patching` boolean)
  const [patchingId, setPatchingId] = useState<number | null>(null);

  // Delete confirm state
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const { data: categories, isLoading } = useGetCategory({ all: true });
  console.log(categories);
  const { mutate, isPending } = useCreateCategory();
  const { mutate: patchCategory } = usePatchCategory();
  const { mutate: deleteCategory, isPending: deleting } = useDeleteCategory({
    hard: true,
  });

  const create = () => {
    if (!name_en.trim()) return;
    mutate(
      { name_en, name_ar: nameAr },
      {
        onSuccess: () => {
          toast({ title: `"${name_en}" تم الإنشاء` });
          setNameEn("");
          setNameAr("");
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          toast({
            title: error?.response?.data?.message || "فشل الإنشاء",
            variant: "destructive",
          });
        },
      },
    );
  };

  const startEdit = (cat: {
    id: number;
    name_en: string;
    name_ar?: string;
    is_active?: boolean;
  }) => {
    setEditingId(cat.id);
    setEditName(cat.name_en ?? "");
    setEditNameAr(cat.name_ar ?? "");
    setEditIsActive(cat.is_active ?? true);
    setConfirmDeleteId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditNameAr("");
    setEditIsActive(true);
  };

  const saveEdit = (id: number) => {
    if (!editName.trim()) return;
    setPatchingId(id);
    patchCategory(
      {
        id,
        body: {
          name_en: editName,
          name_ar: editNameAr,
          is_active: editIsActive,
        },
      },
      {
        onSuccess: () => {
          toast({ title: `"${editName}" تم التحديث` });
          setPatchingId(null);
          cancelEdit();
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          toast({
            title: error?.response?.data?.message || "فشل التحديث",
            variant: "destructive",
          });
          setPatchingId(null);
        },
      },
    );
  };

  const handleDelete = (id: number, catName: string) => {
    deleteCategory(id, {
      onSuccess: () => {
        toast({ title: `"${catName}" تم الحذف` });
        setConfirmDeleteId(null);
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        toast({
          title: error?.response?.data?.message || "فشل الحذف",
          variant: "destructive",
        });
        setConfirmDeleteId(null);
      },
    });
  };

  return (
    <div dir={"rtl"}>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">الفئات</h1>
        <p className="text-gray-400 text-base">إدارة فئات المنتجات</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl items-start">
        {/* Create Category Card */}
        <div className="bg-[#1a1d29] rounded-2xl border border-white/10 overflow-hidden">
          {/* Card Header */}
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fda481] to-[#b4182d] flex items-center justify-center">
                <FolderPlus className="w-8 h-8 text-[#fff]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  فئة جديدة
                </h2>
                <p className="text-sm text-gray-400">اسم الفئة</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <div className="mb-6 flex flex-col gap-4">
              {/* Name EN */}
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  اسم الفئة{" "}
                  <span className="text-[#fff] font-normal text-xs">(EN)</span>
                </label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name_en}
                    onChange={(e) => setNameEn(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && create()}
                    placeholder="Category name"
                    disabled={isPending}
                    dir="ltr"
                    className="w-full pl-12 pr-4 py-4 bg-[#0f1117] border border-white/10 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-[#fff]/50 focus:ring-2 focus:ring-[#fff]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Name AR */}
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  اسم الفئة{" "}
                  <span className="text-[#fff] font-normal text-xs">(AR)</span>
                </label>
                <div className="relative">
                  <Tag className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && create()}
                    placeholder="اسم الفئة بالعربي"
                    disabled={isPending}
                    dir="rtl"
                    className="w-full pr-12 pl-4 py-4 bg-[#0f1117] border border-white/10 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-[#fff]/50 focus:ring-2 focus:ring-[#fff]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={create}
              disabled={isPending || !name_en.trim()}
              className="w-full px-8 py-4 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl font-bold text-lg shadow-xl shadow-[#fff]/25 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <RefreshCw className="animate-spin w-6 h-6" />
                  إنشاء...
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6" />
                  إنشاء فئة
                </>
              )}
            </button>
          </div>
        </div>

        {/* Existing Categories Card */}
        <div className="bg-[#1a1d29] rounded-2xl border border-white/10 overflow-hidden">
          {/* Card Header */}
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-700/20 flex items-center justify-center">
                <Tag className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  الفئات الحالية
                </h2>
                <p className="text-sm text-gray-400">
                  {categories?.length ?? 0} الفئات
                </p>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="md:p-8">
            {isLoading && (
              <div className="flex items-center gap-3 text-gray-400">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <p className="text-sm">جارٍ التحميل...</p>
              </div>
            )}

            {categories?.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <Tag className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500">لا توجد فئات بعد</p>
              </div>
            )}

            <div className="space-y-3">
              {categories?.map((cat: any) => (
                <div
                  key={cat.id}
                  className={`rounded-xl border transition-all overflow-hidden ${
                    editingId === cat.id
                      ? "border-white/20 bg-white/5"
                      : cat.is_active
                        ? "border-emerald-500/15 hover:border-emerald-500/30 hover:bg-emerald-500/5"
                        : "border-white/5 hover:border-white/15 hover:bg-white/3"
                  }`}
                >
                  {/* Normal row */}
                  {editingId !== cat.id && (
                    <div className="flex justify-between items-center p-4">
                      {/* Left: icon + names */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                            cat.is_active
                              ? "bg-emerald-500/15 border border-emerald-500/30"
                              : "bg-white/5 border border-white/10"
                          }`}
                        >
                          <Tag
                            className={`w-4 h-4 ${
                              cat.is_active
                                ? "text-emerald-400"
                                : "text-gray-500"
                            }`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">
                              {cat.name_en}
                            </span>
                            {/* Active / Inactive badge */}
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                                cat.is_active
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                                  : "bg-gray-700/50 text-gray-500 border border-gray-600/30"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  cat.is_active
                                    ? "bg-emerald-400"
                                    : "bg-gray-500"
                                }`}
                              />
                              {cat.is_active ? "مفعل" : "غير مفعل"}
                            </span>
                          </div>
                          {cat.name_ar && (
                            <span
                              className="text-xs text-white/50 block mt-0.5"
                              dir="rtl"
                            >
                              {cat.name_ar}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: id + action buttons */}
                      <div className="flex items-center gap-1.5">
                        {/* Toggle active — green pill button */}
                        <button
                          onClick={() => {
                            setPatchingId(cat.id);
                            patchCategory(
                              {
                                id: cat.id,
                                body: { is_active: !cat.is_active },
                              },
                              {
                                onSuccess: () => {
                                  setPatchingId(null);
                                  toast({
                                    title: `"${cat.name_en}" ${cat.is_active ? "تم إلغاء التفعيل" : "تم التفعيل"}`,
                                  });
                                },
                                onError: (error: AxiosError<ErrorResponse>) => {
                                  setPatchingId(null);
                                  toast({
                                    title:
                                      error?.response?.data?.message ||
                                      "فشل التحديث",
                                    variant: "destructive",
                                  });
                                },
                              },
                            );
                          }}
                          disabled={patchingId === cat.id}
                          title={cat.is_active ? "إلغاء التفعيل" : "تفعيل"}
                          className={`h-10 px-2.5 rounded-lg border text-[10px] font-bold tracking-wide flex items-center gap-1.5 transition-all ${
                            cat.is_active
                              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30"
                              : "bg-gray-700/40 border-gray-600/30 text-gray-500 hover:bg-gray-600/40 hover:text-gray-300"
                          }`}
                        >
                          {patchingId === cat.id ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : cat.is_active ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              {"مفعل"}
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                              {"غير مفعل"}
                            </>
                          )}
                        </button>
                        <div className="flex flex-col md:flex-row gap-2">
                          {/* Edit — blue */}
                          <button
                            onClick={() => startEdit(cat)}
                            title="تعديل"
                            className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400 hover:bg-blue-500/25 hover:border-blue-500/50 flex items-center justify-center transition-all"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>

                          {/* Delete / Confirm delete — red */}
                          {confirmDeleteId === cat.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  handleDelete(cat.id, cat.name_en)
                                }
                                disabled={deleting}
                                title="تأكيد الحذف"
                                className="w-10 h-10 rounded-lg bg-red-500/25 border border-red-500/50 text-red-400 hover:bg-red-500/40 flex items-center justify-center transition-all"
                              >
                                {deleting ? (
                                  <RefreshCw className="w-5 h-5 animate-spin" />
                                ) : (
                                  <Check className="w-5 h-5" />
                                )}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                title="إلغاء"
                                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 flex items-center justify-center transition-all"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setConfirmDeleteId(cat.id);
                                cancelEdit();
                              }}
                              title="حذف"
                              className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/25 hover:border-red-500/40 hover:text-red-400 flex items-center justify-center transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Edit inline row */}
                  {editingId === cat.id && (
                    <div className="p-4 bg-white/5 border border-white/20 rounded-xl space-y-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(cat.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        dir="ltr"
                        placeholder="Category name (EN)"
                        className="w-full px-3 py-2 bg-[#0f1117] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-white/40"
                      />
                      <input
                        type="text"
                        value={editNameAr}
                        onChange={(e) => setEditNameAr(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(cat.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        dir="rtl"
                        placeholder="اسم الفئة بالعربي"
                        className="w-full px-3 py-2 bg-[#0f1117] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-white/40"
                      />

                      {/* is_active toggle */}
                      <button
                        type="button"
                        onClick={() => setEditIsActive((v) => !v)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all w-full ${
                          editIsActive
                            ? "bg-emerald-500/10 border-emerald-500/30"
                            : "bg-white/5 border-white/10"
                        }`}
                      >
                        <span
                          className={`w-8 h-4 rounded-full flex items-center transition-all duration-200 px-0.5 ${
                            editIsActive ? "bg-emerald-500" : "bg-gray-600"
                          }`}
                        >
                          <span
                            className={`w-3 h-3 rounded-full bg-white shadow transition-transform duration-200 ${
                              editIsActive ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            editIsActive ? "text-emerald-400" : "text-gray-500"
                          }`}
                        >
                          {editIsActive ? "مفعل" : "غير مفعل"}
                        </span>
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(cat.id)}
                          disabled={patchingId === cat.id || !editName.trim()}
                          className="flex-1 py-2 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {patchingId === cat.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          {"حفظ"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg text-sm flex items-center gap-2 hover:bg-white/10"
                        >
                          <X className="w-4 h-4" />
                          {"إلغاء"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hint */}
      <div className="mt-6 p-6 bg-[#1a1d29]/50 border border-white/5 rounded-xl max-w-4xl">
        <div className="flex items-center gap-2 text-gray-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">
            اسم الفئة — أدخل اسم الفئة باللغة الإنجليزية والعربية
          </p>
        </div>
      </div>
    </div>
  );
}
