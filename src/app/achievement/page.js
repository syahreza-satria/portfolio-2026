"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SideNav from "../../components/custom/SideNav";
import SpotlightCard from "@/components/SpotlightCard";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ArrowUpRight, Plus, Edit, Trash2, X, Calendar, Award, Hash, ExternalLink, ShieldCheck } from "lucide-react";
import { child, parent } from "../../../animation";
import { useAuth } from "@/lib/auth";
import CrudModal from "@/components/custom/CrudModal";

export default function Achievement() {
  // Format date
  const formatMonthYear = (dateString) => {
    if (!dateString) return "Present";

    const date = new Date(dateString);

    if (isNaN(date)) return dateString;

    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // --- 1. State Management ---
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { user, isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [previewAchievement, setPreviewAchievement] = useState(null);

  const achievementFields = [
    { name: "title", label: "Title", required: true },
    { name: "organizer", label: "Organizer", required: true },
    { name: "credentialId", label: "Credential ID / License", required: false },
    { name: "image", label: "Certificate Image", type: "image", required: false },
    { name: "issuedDate", label: "Issued Date", type: "date", required: true },
    { name: "type", label: "Type", type: "select", options: ["Certification", "Award", "Course", "Participation", "Professional", "other"], required: true },
    { name: "category", label: "Category", type: "select", options: ["Tech", "Design", "Language", "Management", "Other"], required: true },
  ];

  const handleOpenAdd = () => {
    setEditingAchievement(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e, achieve) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingAchievement(achieve);
    setIsModalOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    try {
      const { error } = await supabase.from("achievements").delete().eq("id", id);
      if (error) throw error;
      setAchievements((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  };

  const handleSave = async (formData) => {
    const payload = {
      title: formData.title,
      organizer: formData.organizer,
      credential_id: formData.credentialId,
      image: formData.image,
      issued_date: formData.issuedDate,
      type: formData.type,
      category: formData.category,
    };

    if (editingAchievement) {
      const { data, error } = await supabase
        .from("achievements")
        .update(payload)
        .eq("id", editingAchievement.id)
        .select();
      if (error) throw error;

      const returnedRow = (data && data.length > 0) ? data[0] : { ...editingAchievement, ...payload, credential_id: payload.credential_id, issued_date: payload.issued_date };
      const formatted = { ...returnedRow, credentialId: returnedRow.credential_id, issuedDate: returnedRow.issued_date };
      setAchievements((prev) => {
        const updated = prev.map((a) => (a.id === editingAchievement.id ? formatted : a));
        return updated.sort((a, b) => new Date(b.issuedDate) - new Date(a.issuedDate));
      });
    } else {
      const { data, error } = await supabase
        .from("achievements")
        .insert([payload])
        .select();
      if (error) throw error;

      const returnedRow = (data && data.length > 0) ? data[0] : { id: Date.now(), ...payload, credential_id: payload.credential_id, issued_date: payload.issued_date };
      const formatted = { ...returnedRow, credentialId: returnedRow.credential_id, issuedDate: returnedRow.issued_date };
      setAchievements((prev) => {
        const updated = [...prev, formatted];
        return updated.sort((a, b) => new Date(b.issuedDate) - new Date(a.issuedDate));
      });
    }
  };

  // --- 2. Fetch Data dari Supabase ---
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const { data, error } = await supabase.from("achievements").select("*").order("issued_date", { ascending: false }); // Mengurutkan berdasarkan tanggal terbit terbaru

        if (error) throw error;

        // Mapping data dari snake_case (DB) ke camelCase (UI)
        const formattedData = data.map((item) => ({
          ...item,
          credentialId: item.credential_id,
          issuedDate: item.issued_date,
        }));

        setAchievements(formattedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // --- 3. Filter Logic ---
  const uniqueTypes = ["All", ...new Set(achievements.map((item) => item.type))];
  const uniqueCategories = ["All", ...new Set(achievements.map((item) => item.category))];

  const filteredAchievements = achievements.filter((achieve) => {
    const matchesSearch = achieve.title.toLowerCase().includes(searchQuery.toLowerCase()) || achieve.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || achieve.type === selectedType;
    const matchesCategory = selectedCategory === "All" || achieve.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  // --- 4. Fungsi Render Konten (Untuk handle Loading & Error tanpa merusak layout) ---
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          {/* Header skeletons */}
          <div className="space-y-2.5 animate-pulse">
            <div className="h-4 w-40 bg-neutral-800/60 rounded-md" />
            <div className="h-4.5 w-48 bg-neutral-800/60 rounded-md" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-3xl border border-neutral-800/80 bg-neutral-900/40 p-0 flex flex-col gap-3 h-[350px]">
                {/* Image Placeholder */}
                <div className="w-full aspect-[297/210] rounded-t-3xl bg-neutral-800/50" />
                {/* Info Placeholders */}
                <div className="px-4 py-2 flex flex-col grow gap-2.5">
                  <div className="h-3 w-1/3 bg-neutral-800/60 rounded-md" />
                  <div className="h-4 w-5/6 bg-neutral-800/60 rounded-md" />
                  <div className="h-3.5 w-1/2 bg-neutral-800/40 rounded-md" />
                  <div className="mt-auto pt-4 pb-2">
                    <div className="flex gap-2 mb-4">
                      <div className="h-5 w-16 bg-neutral-800/50 rounded-full" />
                      <div className="h-5 w-16 bg-neutral-800/50 rounded-full" />
                    </div>
                    <hr className="border-neutral-800/80 mb-3" />
                    <div className="h-3 w-24 bg-neutral-800/40 rounded" />
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
        {/* Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 justify-between w-full">
          <Input
            type="text"
            placeholder="Search title or organizer..."
            className="bg-neutral-800 border-neutral-700 w-full md:max-w-xs text-neutral-200 focus-visible:ring-emerald-500/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex gap-3 w-full md:w-auto">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-37.5 bg-neutral-800 border-neutral-700 text-neutral-200 focus:ring-emerald-500/50">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700 text-neutral-200">
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type} className="focus:bg-neutral-700 focus:text-white cursor-pointer">
                    {type === "All" ? "All Types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-40 bg-neutral-800 border-neutral-700 text-neutral-200 focus:ring-emerald-500/50">
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
          </div>
        </div>

        <p className="text-neutral-400 font-medium text-sm">Showing {filteredAchievements.length} achievements</p>

        {/* List Section */}
        <motion.div variants={parent} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...filteredAchievements].map((achieve) => (
            <motion.div variants={child} key={achieve.id} className="h-full">
              {/* Diperbaiki p-0! menjadi !p-0 */}
              <SpotlightCard
                onClick={() => setPreviewAchievement(achieve)}
                className="custom-spotlight-card !p-0 flex flex-col gap-3 rounded-3xl h-full group relative cursor-pointer hover:border-neutral-700 transition-all duration-300"
                spotlightColor="rgba(0, 229, 255, 0.15)"
              >
                {isAdmin && (
                  <div className="absolute top-3 right-3 z-20 flex gap-2">
                    <button
                      onClick={(e) => handleOpenEdit(e, achieve)}
                      className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 backdrop-blur transition-all cursor-pointer"
                      title="Edit Achievement"
                    >
                      <Edit className="size-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, achieve.id)}
                      className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-red-950/80 text-neutral-300 hover:text-red-405 border border-neutral-800 hover:border-red-900 backdrop-blur transition-all cursor-pointer"
                      title="Delete Achievement"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                )}
                <div className="relative w-full aspect-[297/210] rounded-t-3xl overflow-hidden border-b border-neutral-700/50">
                  {achieve.image && <Image src={achieve.image} alt={achieve.title} fill loading="eager" className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-w-7xl) 33vw, 100vw" priority={false} />}
                </div>

                <div className="px-4 py-2 flex flex-col grow">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-mono text-neutral-500 tracking-wider">{achieve.credentialId}</span>
                    <h3 className="text-white font-medium tracking-tight leading-snug line-clamp-2">{achieve.title}</h3>
                    <p className="text-neutral-400 text-sm">{achieve.organizer}</p>
                  </div>

                  <div className="mt-auto flex flex-col pt-4 pb-2">
                    <div className="flex w-full flex-wrap justify-start gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs bg-neutral-800 text-neutral-300 border-neutral-700">
                        {achieve.type}
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-neutral-800 text-neutral-300 border-neutral-700">
                        {achieve.category}
                      </Badge>
                    </div>

                    <div>
                      <hr className="border-neutral-700/80 mb-3" />
                      <span className="text-neutral-500 text-[11px] font-semibold tracking-widest uppercase">ISSUED ON {formatMonthYear(achieve.issued_date)}</span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && <div className="w-full text-center py-12 text-neutral-500 bg-neutral-900/20 rounded-xl border border-neutral-800 border-dashed">No achievements found matching your criteria.</div>}
      </>
    );
  };

  return (
    <div className="max-w-7xl w-full mx-auto grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8 px-4 sm:px-6">
      <SideNav />

      <motion.div animate={{ y: 0, opacity: 1 }} initial={{ y: 20, opacity: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="col-span-1 sm:col-span-9 w-full space-y-6 pb-16">
        <section className="flex justify-between items-center gap-4 w-full">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-medium tracking-tighter">Achievement</h1>
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed">A curated showcase of certifications and milestones reflecting my ongoing commitment to professional growth and technical excellence.</p>
          </div>
          {isAdmin && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-lg shadow-emerald-600/10 active:scale-95"
            >
              <Plus className="size-4" />
              <span>Add Achievement</span>
            </button>
          )}
        </section>

        <hr className="border-neutral-500 border-dashed" />

        <section className="space-y-6">{renderContent()}</section>

        <CrudModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingAchievement ? "Edit Achievement" : "Add Achievement"}
          onSubmit={handleSave}
          initialData={editingAchievement}
          fields={achievementFields}
        />

        {/* Certificate Preview Lightbox / Details Modal */}
        <AnimatePresence>
          {previewAchievement && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setPreviewAchievement(null)}
                className="absolute inset-0 bg-neutral-950/85 backdrop-blur-md"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative bg-neutral-900 border border-neutral-805 rounded-xl w-full max-w-6xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 flex flex-col md:flex-row max-h-[90vh] md:h-[600px]"
              >
                {/* Close Button (Floating Top Right of Card for easier tap/click) */}
                <button
                  onClick={() => setPreviewAchievement(null)}
                  className="absolute top-4 right-4 z-40 p-2 rounded-full bg-neutral-950/80 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
                >
                  <X className="size-4" />
                </button>

                {/* Left Side: Image Preview */}
                <div className="w-full md:w-[72%] bg-white relative h-[250px] md:h-full border-b md:border-b-0 md:border-r border-neutral-850">
                  {previewAchievement.image ? (
                    <Image
                      src={previewAchievement.image}
                      alt={previewAchievement.title}
                      fill
                      className="object-cover"
                      sizes="(max-w-4xl) 72vw, 100vw"
                      priority
                    />
                  ) : (
                    <div className="text-center py-12 text-neutral-500 flex flex-col items-center gap-3 w-full h-full justify-center bg-neutral-950">
                      <Award className="size-16 text-neutral-800" />
                      <span>No certificate image uploaded</span>
                    </div>
                  )}
                </div>

                {/* Right Side: Details Info */}
                <div className="w-full md:w-[28%] p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-neutral-900 relative">
                  <div className="space-y-6">
                    {/* Header: Title and Organizer */}
                    <div className="space-y-3 pr-4">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                          {previewAchievement.type}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-300 bg-neutral-800 border border-neutral-700/80 px-2 py-0.5 rounded-md">
                          {previewAchievement.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white tracking-tight leading-tight">
                        {previewAchievement.title}
                      </h3>
                      <p className="text-neutral-400 text-sm font-medium flex items-center gap-1.5">
                        <Award className="size-4 text-neutral-500 shrink-0" />
                        {previewAchievement.organizer}
                      </p>
                    </div>

                    {/* Metadata Section */}
                    <div className="space-y-4 pt-2 border-t border-neutral-850">
                      {/* Credential ID */}
                      {previewAchievement.credentialId && (
                        <div className="space-y-1">
                          <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Credential ID</span>
                          <span className="text-neutral-300 text-sm font-medium font-mono break-all bg-neutral-950 px-2.5 py-1.5 rounded-xl border border-neutral-800/80 flex items-center gap-2">
                            <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
                            {previewAchievement.credentialId}
                          </span>
                        </div>
                      )}

                      {/* Issue Date */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Issue Date</span>
                        <span className="text-neutral-300 text-sm font-medium bg-neutral-950 px-2.5 py-1.5 rounded-xl border border-neutral-800/80 flex items-center gap-2">
                          <Calendar className="size-4 text-neutral-500 shrink-0" />
                          {formatMonthYear(previewAchievement.issued_date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Branding Info */}
                  <div className="mt-8 pt-4 border-t border-neutral-850 text-center text-neutral-600 text-[10px] uppercase tracking-widest font-bold">
                    Verified Credential
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
