"use client";

import { useState } from "react";
import { Upload, Loader2, Plus, X, ChevronLeft, ChevronRight, Move } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

const projectTypes = ["Web App", "Design", "Mobile App", "Desktop App", "Other"];
const categories = ["Full-Stack Web", "Frontend", "Backend", "UI/UX Design", "Mobile", "Other"];
const projectStatuses = ["In Progress", "Live", "Completed", "Design Phase", "Concept", "Maintenance", "Archived"];

export default function ProjectForm({ initialData = null, onSubmit, onCancel, buttonText = "Save Project" }) {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      let currentStatus = "In Progress";
      if (initialData.status === true || String(initialData.status).toLowerCase() === 'true' || String(initialData.status).toLowerCase() === 'live') {
        currentStatus = "Live";
      } else if (initialData.status === false || String(initialData.status).toLowerCase() === 'false') {
        currentStatus = "In Progress";
      } else if (initialData.status) {
        currentStatus = initialData.status;
      }
      return {
        title: initialData.title || "",
        description: initialData.description || "",
        image: initialData.image || "",
        type: initialData.type || "Web App",
        category: initialData.category || "Full-Stack Web",
        techstack: initialData.techstack || [],
        demoLink: initialData.demoLink || initialData.demo_link || "",
        github: initialData.github || "",
        status: currentStatus,
        role: initialData.role || "",
        features: initialData.features || [],
        gallery: initialData.gallery || [],
        project_date: initialData.project_date || "",
      };
    }
    return {
      title: "",
      description: "",
      image: "",
      type: "Web App",
      category: "Full-Stack Web",
      techstack: [],
      demoLink: "",
      github: "",
      status: "In Progress",
      role: "",
      features: [],
      gallery: [],
      project_date: "",
    };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [techstackInput, setTechstackInput] = useState(() => {
    return (initialData && initialData.techstack) ? initialData.techstack.join(", ") : "";
  });
  const [featuresInput, setFeaturesInput] = useState(() => {
    return (initialData && initialData.features) ? initialData.features.join(", ") : "";
  });
  const [galleryInput, setGalleryInput] = useState(() => {
    return (initialData && initialData.gallery) ? initialData.gallery.join(", ") : "";
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechstackChange = (valStr) => {
    setTechstackInput(valStr);
    const arr = valStr.split(",").map((s) => s.trim()).filter(Boolean);
    handleChange("techstack", arr);
  };

  const handleFeaturesChange = (valStr) => {
    setFeaturesInput(valStr);
    const arr = valStr.split(",").map((s) => s.trim()).filter(Boolean);
    handleChange("features", arr);
  };

  const handleGalleryInputChange = (valStr) => {
    setGalleryInput(valStr);
    const arr = valStr.split(",").map((s) => s.trim()).filter(Boolean);
    handleChange("gallery", arr);
  };

  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleFileUpload = async (file, isGallery = false) => {
    if (!file) return;
    if (isGallery) {
      setUploadingGallery(true);
    } else {
      setUploadingImage(true);
    }
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      let bucketName = "portfolio";
      let { data, error } = await supabase.storage.from(bucketName).upload(filePath, file);
      
      if (error) {
        bucketName = "uploads";
        const retry = await supabase.storage.from(bucketName).upload(filePath, file);
        if (retry.error) throw retry.error;
        data = retry.data;
      }

      const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      
      if (isGallery) {
        setFormData((prev) => {
          const newGallery = [...prev.gallery, publicUrl];
          setGalleryInput(newGallery.join(", "));
          return { ...prev, gallery: newGallery };
        });
      } else {
        handleChange("image", publicUrl);
      }
    } catch (err) {
      console.error("Upload error:", err.message);
      alert("Failed to upload image. Error: " + err.message);
    } finally {
      if (isGallery) {
        setUploadingGallery(false);
      } else {
        setUploadingImage(false);
      }
    }
  };

  const handleMultipleFileUploads = async (files) => {
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        let bucketName = "portfolio";
        let { data, error } = await supabase.storage.from(bucketName).upload(filePath, file);
        
        if (error) {
          bucketName = "uploads";
          const retry = await supabase.storage.from(bucketName).upload(filePath, file);
          if (retry.error) throw retry.error;
          data = retry.data;
        }

        const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(filePath);
        return publicUrl;
      });

      const publicUrls = await Promise.all(uploadPromises);
      
      setFormData((prev) => {
        const newGallery = [...prev.gallery, ...publicUrls];
        setGalleryInput(newGallery.join(", "));
        return { ...prev, gallery: newGallery };
      });
    } catch (err) {
      console.error("Upload error:", err.message);
      alert("Failed to upload some gallery images. Error: " + err.message);
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    const newGallery = formData.gallery.filter((_, idx) => idx !== indexToRemove);
    handleChange("gallery", newGallery);
    setGalleryInput(newGallery.join(", "));
  };

  const handleMoveGalleryImage = (index, direction) => {
    const newGallery = [...formData.gallery];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newGallery.length) return;

    const temp = newGallery[index];
    newGallery[index] = newGallery[targetIndex];
    newGallery[targetIndex] = temp;

    handleChange("gallery", newGallery);
    setGalleryInput(newGallery.join(", "));
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newGallery = [...formData.gallery];
    const draggedItem = newGallery[draggedIndex];
    newGallery.splice(draggedIndex, 1);
    newGallery.splice(targetIndex, 0, draggedItem);

    handleChange("gallery", newGallery);
    setGalleryInput(newGallery.join(", "));
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error(err);
      alert("Error saving project: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-neutral-900/40 border border-neutral-800/80 p-6 md:p-8 rounded-[2rem] shadow-xl backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-neutral-300 font-medium text-sm">Project Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="e.g. LunasinYuk - Financial Tracker"
            className="bg-neutral-800/50 border border-neutral-700/60 text-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-full"
            required
          />
        </div>

        {/* Project Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-neutral-300 font-medium text-sm">Project Type</label>
          <select
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="bg-neutral-800/50 border border-neutral-700/60 text-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
            required
          >
            {projectTypes.map((opt) => (
              <option key={opt} value={opt} className="bg-neutral-900">{opt}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-neutral-300 font-medium text-sm">Category</label>
          <select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="bg-neutral-800/50 border border-neutral-700/60 text-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
            required
          >
            {categories.map((opt) => (
              <option key={opt} value={opt} className="bg-neutral-900">{opt}</option>
            ))}
          </select>
        </div>

        {/* Developer Role */}
        <div className="flex flex-col gap-1.5">
          <label className="text-neutral-300 font-medium text-sm">Your Role</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
            placeholder="e.g. Lead Full-Stack Developer, UI/UX Designer"
            className="bg-neutral-800/50 border border-neutral-700/60 text-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-full"
            required
          />
        </div>

        {/* Project Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-neutral-300 font-medium text-sm">Project Date</label>
          <input
            type="date"
            value={formData.project_date}
            onChange={(e) => handleChange("project_date", e.target.value)}
            className="bg-neutral-800/50 border border-neutral-700/60 text-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer w-full"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-neutral-300 font-medium text-sm">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe the project goals, features, achievements..."
            className="bg-neutral-800/50 border border-neutral-700/60 text-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[120px] w-full"
            required
          />
        </div>

        {/* Image upload / URL */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-neutral-300 font-medium text-sm">Main Thumbnail Image</label>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <input
              type="text"
              value={formData.image}
              onChange={(e) => handleChange("image", e.target.value)}
              placeholder="Paste image URL or upload file below"
              className="bg-neutral-800/50 border border-neutral-700/60 text-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 grow"
            />
            
            <div className="relative shrink-0 flex items-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files[0], false)}
                className="hidden"
                id="image-file-input"
                disabled={uploadingImage}
              />
              <label
                htmlFor="image-file-input"
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-neutral-800 hover:bg-neutral-750 hover:border-neutral-600 text-neutral-200 text-xs px-4 py-3 border border-neutral-700 rounded-xl cursor-pointer transition-all active:scale-95 font-medium shrink-0"
              >
                {uploadingImage ? (
                  <Loader2 className="size-4 animate-spin text-emerald-500" />
                ) : (
                  <Upload className="size-4" />
                )}
                <span>{uploadingImage ? "Uploading..." : "Upload Image"}</span>
              </label>
            </div>

            {formData.image && (
              <div className="relative size-12 shrink-0 rounded-xl overflow-hidden border border-neutral-750 bg-neutral-950 mx-auto sm:mx-0">
                <Image src={formData.image} alt="Preview" fill className="object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-neutral-300 font-medium text-sm">Tech Stack</label>
          <input
            type="text"
            value={techstackInput}
            onChange={(e) => handleTechstackChange(e.target.value)}
            placeholder="e.g. React, Next.js, Tailwind CSS, Supabase"
            className="bg-neutral-800/50 border border-neutral-700/60 text-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-full"
          />
          <span className="text-neutral-500 text-[11px]">Comma-separated list of technologies.</span>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-neutral-300 font-medium text-sm">Key Features</label>
          <input
            type="text"
            value={featuresInput}
            onChange={(e) => handleFeaturesChange(e.target.value)}
            placeholder="e.g. Real-time updates, OAuth google login, Responsive admin page"
            className="bg-neutral-800/50 border border-neutral-700/60 text-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-full"
          />
          <span className="text-neutral-500 text-[11px]">Comma-separated list of important features of this project.</span>
        </div>

        {/* Gallery upload / URL */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-neutral-300 font-medium text-sm">Project Screenshots Gallery</label>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                type="text"
                value={galleryInput}
                onChange={(e) => handleGalleryInputChange(e.target.value)}
                placeholder="Paste screenshots URLs (comma separated) or upload files below"
                className="bg-neutral-800/50 border border-neutral-700/60 text-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 grow"
              />
              
              <div className="relative shrink-0 flex items-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleMultipleFileUploads(e.target.files)}
                  className="hidden"
                  id="gallery-file-input"
                  disabled={uploadingGallery}
                />
                <label
                  htmlFor="gallery-file-input"
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-neutral-800 hover:bg-neutral-750 hover:border-neutral-600 text-neutral-200 text-xs px-4 py-3 border border-neutral-700 rounded-xl cursor-pointer transition-all active:scale-95 font-medium shrink-0"
                >
                  {uploadingGallery ? (
                    <Loader2 className="size-4 animate-spin text-emerald-500" />
                  ) : (
                    <Upload className="size-4" />
                  )}
                  <span>{uploadingGallery ? "Uploading..." : "Add to Gallery"}</span>
                </label>
              </div>
            </div>

            {/* Gallery Previews with delete button and reordering */}
            {formData.gallery && formData.gallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 p-3 bg-neutral-950/30 border border-neutral-800/50 rounded-2xl">
                {formData.gallery.map((imgUrl, idx) => {
                  const isDragged = draggedIndex === idx;
                  return (
                    <div
                      key={idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragEnd={handleDragEnd}
                      onDrop={(e) => handleDrop(e, idx)}
                      className={`relative aspect-video rounded-lg overflow-hidden border bg-neutral-950 group transition-all cursor-grab active:cursor-grabbing ${
                        isDragged
                          ? "border-emerald-500/50 opacity-40 scale-95"
                          : "border-neutral-750 hover:border-neutral-600"
                      }`}
                    >
                      <Image src={imgUrl} alt={`Screenshot ${idx + 1}`} fill className="object-cover pointer-events-none" />
                      
                      {/* Drag handle icon / helper overlay on hover */}
                      <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
                        <Move className="size-5 text-neutral-300 drop-shadow animate-pulse" />
                      </div>

                      {/* Index badge */}
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-neutral-900/80 border border-neutral-700/50 text-[10px] font-bold text-neutral-300 pointer-events-none">
                        #{idx + 1}
                      </div>

                      {/* Reorder and Delete Controls */}
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-1">
                        <div className="flex gap-1">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveGalleryImage(idx, -1);
                              }}
                              className="p-1 rounded bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/50 text-neutral-300 cursor-pointer transition-colors"
                              title="Move Left"
                            >
                              <ChevronLeft className="size-3" />
                            </button>
                          )}
                          {idx < formData.gallery.length - 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveGalleryImage(idx, 1);
                              }}
                              className="p-1 rounded bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/50 text-neutral-300 cursor-pointer transition-colors"
                              title="Move Right"
                            >
                              <ChevronRight className="size-3" />
                            </button>
                          )}
                        </div>
                        
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveGalleryImage(idx);
                          }}
                          className="p-1 rounded bg-red-950/80 hover:bg-red-900 border border-red-900/50 text-white cursor-pointer transition-colors"
                          title="Remove Image"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* GitHub URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-neutral-300 font-medium text-sm">GitHub URL (Optional)</label>
          <input
            type="url"
            value={formData.github}
            onChange={(e) => handleChange("github", e.target.value)}
            placeholder="https://github.com/..."
            className="bg-neutral-800/50 border border-neutral-700/60 text-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-full"
          />
        </div>

        {/* Live Demo URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-neutral-300 font-medium text-sm">Live Demo URL (Optional)</label>
          <input
            type="url"
            value={formData.demoLink}
            onChange={(e) => handleChange("demoLink", e.target.value)}
            placeholder="https://..."
            className="bg-neutral-800/50 border border-neutral-700/60 text-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-full"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-neutral-300 font-medium text-sm">Project Status</label>
          <select
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="bg-neutral-800/50 border border-neutral-700/60 text-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer w-full"
            required
          >
            {projectStatuses.map((opt) => (
              <option key={opt} value={opt} className="bg-neutral-900">{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-neutral-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || uploadingImage || uploadingGallery}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-600/10 active:scale-95"
        >
          {isSubmitting ? "Saving..." : buttonText}
        </button>
      </div>
    </form>
  );
}
