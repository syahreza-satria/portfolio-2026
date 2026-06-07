"use client";

import { useEffect, useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/lib/supabase";

export default function CrudModal({ isOpen, onClose, title, onSubmit, initialData = null, fields = [] }) {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [arrayInputs, setArrayInputs] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      const initialArrayInputs = {};
      fields.forEach((f) => {
        if (f.type === "array" && Array.isArray(initialData[f.name])) {
          const sep = f.separator || ",";
          initialArrayInputs[f.name] = initialData[f.name].join(sep + " ");
        }
      });
      setArrayInputs(initialArrayInputs);
    } else {
      const defaultData = {};
      const initialArrayInputs = {};
      fields.forEach((f) => {
        defaultData[f.name] = f.type === "checkbox" || f.type === "switch" ? false : f.type === "array" ? [] : "";
        if (f.type === "array") {
          initialArrayInputs[f.name] = "";
        }
      });
      setFormData(defaultData);
      setArrayInputs(initialArrayInputs);
    }
  }, [initialData, isOpen, fields]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name, valStr, separator = ",") => {
    setArrayInputs((prev) => ({ ...prev, [name]: valStr }));
    const arr = valStr.split(separator).map((s) => s.trim()).filter(Boolean);
    handleChange(name, arr);
  };

  const handleFileUpload = async (name, file) => {
    if (!file) return;
    setUploadingField(name);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload file to Supabase storage 'portfolio' bucket (or fallback to 'uploads')
      let bucketName = "portfolio";
      let { data, error } = await supabase.storage.from(bucketName).upload(filePath, file);
      
      // If bucket 'portfolio' doesn't exist or fails, retry with 'uploads'
      if (error) {
        bucketName = "uploads";
        const retry = await supabase.storage.from(bucketName).upload(filePath, file);
        if (retry.error) throw retry.error;
        data = retry.data;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      handleChange(name, publicUrl);
    } catch (err) {
      console.error("Upload error:", err.message);
      alert("Failed to upload image. Please check if your Supabase Storage bucket ('portfolio' or 'uploads') exists and allows public uploads. Error: " + err.message);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error saving: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl z-10 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-800 shrink-0">
              <h2 className="text-white font-medium text-lg">{title}</h2>
              <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                <X className="size-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex flex-col grow overflow-y-auto px-6 py-4 space-y-4 font-sans">
              {fields.map((field) => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label className="text-neutral-300 font-medium text-sm">{field.label}</label>
                  
                  {field.type === "textarea" ? (
                    <textarea
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="bg-neutral-800 border border-neutral-700/60 text-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[80px]"
                      required={field.required}
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="bg-neutral-800 border border-neutral-700/60 text-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
                      required={field.required}
                    >
                      <option value="" disabled>Select {field.label}</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === "checkbox" || field.type === "switch" ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="checkbox"
                        checked={!!formData[field.name]}
                        onChange={(e) => handleChange(field.name, e.target.checked)}
                        className="size-4.5 rounded border-neutral-700 bg-neutral-800 text-emerald-500 focus:ring-emerald-500/50 accent-emerald-500 cursor-pointer"
                      />
                      <span className="text-neutral-400 text-sm">{field.description}</span>
                    </div>
                  ) : field.type === "array" ? (
                    <div>
                      <input
                        type="text"
                        value={arrayInputs[field.name] !== undefined ? arrayInputs[field.name] : ""}
                        onChange={(e) => handleArrayChange(field.name, e.target.value, field.separator || ",")}
                        placeholder={field.placeholder || "e.g. React, Next.js, Tailwind CSS"}
                        className="bg-neutral-800 border border-neutral-700/60 text-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-full"
                      />
                      <span className="text-neutral-500 text-[11px] mt-1 block">
                        {field.separator === ";" ? "Semicolon-separated list" : "Comma-separated list"}
                      </span>
                    </div>
                  ) : field.type === "image" ? (
                    <div className="space-y-2">
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={formData[field.name] || ""}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          placeholder="Paste image URL or upload file"
                          className="bg-neutral-800 border border-neutral-700/60 text-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 grow"
                          required={field.required}
                        />
                        
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(field.name, e.target.files[0])}
                          className="hidden"
                          id={`file-${field.name}`}
                          disabled={uploadingField === field.name}
                        />
                        <label
                          htmlFor={`file-${field.name}`}
                          className="flex items-center justify-center gap-1.5 bg-neutral-800 border border-neutral-700 hover:bg-neutral-750 hover:border-neutral-600 text-neutral-200 text-xs px-3.5 py-2.5 rounded-xl cursor-pointer transition-all shrink-0 active:scale-95 font-medium"
                        >
                          {uploadingField === field.name ? (
                            <Loader2 className="size-3.5 animate-spin text-emerald-500" />
                          ) : (
                            <Upload className="size-3.5" />
                          )}
                          <span>{uploadingField === field.name ? "Uploading..." : "Upload"}</span>
                        </label>

                        {formData[field.name] && (
                          <div className="relative size-9.5 shrink-0 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-950">
                            <img src={formData[field.name]} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : field.type === "date" ? (
                    <input
                      type="date"
                      value={(() => {
                        const val = formData[field.name];
                        if (!val) return "";
                        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
                        try {
                          const d = new Date(val);
                          if (!isNaN(d.getTime())) {
                            return d.toISOString().split("T")[0];
                          }
                        } catch (e) {}
                        return "";
                      })()}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="bg-neutral-800 border border-neutral-700/60 text-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
                      required={field.required}
                    />
                  ) : (
                    <input
                      type={field.type || "text"}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="bg-neutral-800 border border-neutral-700/60 text-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      required={field.required}
                    />
                  )}
                </div>
              ))}

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-sm px-5 py-2 rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-600/10 active:scale-95"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
