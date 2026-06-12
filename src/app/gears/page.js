"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabase";
import SideNav from "../../components/custom/SideNav";
import { ArrowUpRight, Plus, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import SpotlightCard from "@/components/SpotlightCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import CrudModal from "@/components/custom/CrudModal";

export default function Gear() {
  // --- 1. State Management ---
  const [gears, setGears] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { user, isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGear, setEditingGear] = useState(null);

  const gearFields = [
    { name: "brand", label: "Brand", required: true },
    { name: "model", label: "Model", required: true },
    { name: "description", label: "Description", type: "textarea", required: true },
    { name: "image", label: "Gear Image", type: "image", required: false },
    { name: "link", label: "Product Link", required: false },
    { name: "category", label: "Category", type: "select", options: ["Computer", "Video", "Audio"], required: true },
  ];

  const handleOpenAdd = () => {
    setEditingGear(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e, gear) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingGear(gear);
    setIsModalOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this gear item?")) return;
    try {
      const { error } = await supabase.from("gears").delete().eq("id", id);
      if (error) throw error;
      setGears((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  };

  const handleSave = async (formData) => {
    const payload = {
      brand: formData.brand,
      model: formData.model,
      description: formData.description,
      image: formData.image,
      link: formData.link,
      category: formData.category,
    };

    if (editingGear) {
      const { data, error } = await supabase
        .from("gears")
        .update(payload)
        .eq("id", editingGear.id)
        .select();
      if (error) throw error;
      const updatedRow = (data && data.length > 0) ? data[0] : { ...editingGear, ...payload };
      setGears((prev) => prev.map((g) => (g.id === editingGear.id ? updatedRow : g)));
    } else {
      const { data, error } = await supabase
        .from("gears")
        .insert([payload])
        .select();
      if (error) throw error;
      const insertedRow = (data && data.length > 0) ? data[0] : { id: Date.now(), ...payload };
      setGears((prev) => [...prev, insertedRow]);
    }
  };

  // --- 2. Fetch Data dari Supabase ---
  useEffect(() => {
    const fetchGears = async () => {
      try {
        const { data, error } = await supabase
          .from("gears") // Nama tabel di Supabase
          .select("*")
          .order("id", { ascending: true }); // Opsional: mengurutkan berdasarkan ID

        if (error) throw error;
        setGears(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGears();
  }, []);

  // --- 3. Filter Logic ---
  const uniqueCategories = ["All", ...new Set(gears.map((gear) => gear.category))];
  const filteredGears = selectedCategory === "All" ? gears : gears.filter((gear) => gear.category === selectedCategory);

  // --- 4. Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.3,
    },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 250,
        damping: 15,
      },
    },
  };

  // --- 5. Render Konten Dinamis (Loading & Data) ---
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          {/* Header skeletons */}
          <div className="space-y-2.5 animate-pulse">
            <div className="h-4 w-40 bg-neutral-800/60 rounded-md" />
            <div className="h-4.5 w-48 bg-neutral-800/60 rounded-md" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-3xl border border-neutral-800/80 bg-neutral-900/40 p-0 flex flex-col gap-3 h-[380px]">
                {/* Image Placeholder */}
                <div className="w-full aspect-square rounded-t-3xl bg-neutral-800/50" />
                {/* Info Placeholders */}
                <div className="px-5 py-3 flex flex-col grow gap-3">
                  <div className="h-3 w-1/4 bg-neutral-800/60 rounded-md" />
                  <div className="h-5 w-3/4 bg-neutral-800/60 rounded-md" />
                  <div className="space-y-2 mt-1">
                    <div className="h-3.5 w-full bg-neutral-800/40 rounded-md" />
                    <div className="h-3.5 w-5/6 bg-neutral-800/40 rounded-md" />
                  </div>
                  <div className="mt-auto pt-5 pb-2">
                    <hr className="border-neutral-800/80 mb-3" />
                    <div className="h-3 w-20 bg-neutral-800/40 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (error) {
      return <div className="text-center py-20 text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">Error: {error}</div>;
    }

    return (
      <>
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-neutral-400 font-medium text-sm">Showing {filteredGears.length} items</p>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-50 bg-neutral-800 border-neutral-700 text-neutral-200 focus:ring-emerald-500/50 outline-none">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700 text-neutral-200">
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category} className="focus:bg-neutral-700 focus:text-white cursor-pointer">
                  {category === "All" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        <motion.section variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGears.map((gear) => (
            <motion.div variants={itemVariants} key={gear.id} className="h-full">
              {/* Typo p-0! diperbaiki menjadi !p-0 */}
              <SpotlightCard className="custom-spotlight-card !p-0 flex flex-col gap-3 rounded-3xl h-full group relative" spotlightColor="rgba(0, 229, 255, 0.15)">
                {isAdmin && (
                  <div className="absolute top-3 right-3 z-20 flex gap-2">
                    <button
                      onClick={(e) => handleOpenEdit(e, gear)}
                      className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 backdrop-blur transition-all cursor-pointer"
                      title="Edit Gear"
                    >
                      <Edit className="size-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, gear.id)}
                      className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-red-950/80 text-neutral-300 hover:text-red-405 border border-neutral-800 hover:border-red-900 backdrop-blur transition-all cursor-pointer"
                      title="Delete Gear"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                )}
                <div className="relative w-full aspect-square rounded-t-3xl overflow-hidden border-b border-neutral-700/50 bg-neutral-900/50">
                  {gear.image && <Image src={gear.image} alt={gear.model} fill loading="eager" className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-w-7xl) 33vw, 100vw" />}
                </div>

                <div className="px-5 py-3 flex flex-col grow">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-emerald-500 tracking-wider uppercase">{gear.brand}</span>
                    <h3 className="text-white font-medium text-lg tracking-tight leading-snug">{gear.model}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3 mt-1">{gear.description}</p>
                  </div>

                  <div className="mt-auto flex flex-col pt-5 pb-2">
                    <hr className="border-neutral-700/80 mb-3" />
                    {gear.link ? (
                      <a href={gear.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full text-neutral-400 hover:text-white transition-colors duration-300 group/link">
                        <span className="text-[11px] font-semibold tracking-widest uppercase">View Product</span>
                        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                      </a>
                    ) : (
                      <div className="flex items-center justify-between w-full text-neutral-600">
                        <span className="text-[11px] font-semibold tracking-widest uppercase">Link Unavailable</span>
                      </div>
                    )}
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.section>

        {filteredGears.length === 0 && <div className="w-full text-center py-12 text-neutral-500 bg-neutral-900/20 rounded-xl border border-neutral-800 border-dashed">No gears found in this category.</div>}
      </>
    );
  };

  return (
    <div className="max-w-7xl w-full mx-auto grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8 px-4 sm:px-6">
      <SideNav />

      <motion.div animate={{ y: 0, opacity: 1 }} initial={{ y: 20, opacity: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="col-span-1 sm:col-span-9 w-full space-y-6 pb-16">
        <section className="flex justify-between items-center gap-4 w-full">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-medium tracking-tighter">Gear</h1>
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed">A detailed look at the hardware tools that power my daily workflow, from full-stack development to UI/UX design and content creation.</p>
          </div>
          {isAdmin && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-lg shadow-emerald-600/10 active:scale-95"
            >
              <Plus className="size-4" />
              <span>Add Gear</span>
            </button>
          )}
        </section>

        <hr className="border-neutral-500 border-dashed" />

        <div className="space-y-6">{renderContent()}</div>

        <CrudModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingGear ? "Edit Gear Item" : "Add Gear Item"}
          onSubmit={handleSave}
          initialData={editingGear}
          fields={gearFields}
        />
      </motion.div>
    </div>
  );
}
