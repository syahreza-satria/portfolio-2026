"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { PiBriefcase, PiPlus } from "react-icons/pi";
import { Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import SideNav from "../../components/custom/SideNav";
import ExperienceCard from "@/components/custom/ExperienceCard";
import EducationCard from "@/components/custom/EducationCard";
import { child, parent } from "@/constants/animation";
import { useAuth } from "@/hooks/useAuth";
import CrudModal from "@/components/custom/CrudModal";

export default function About() {
  // --- 1. State Management ---
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("experience"); // "experience" or "education"
  const [editingItem, setEditingItem] = useState(null);

  const calculateDuration = (startDateStr, endDateStr) => {
    if (!startDateStr) return "";
    const start = new Date(startDateStr);
    const end = endDateStr ? new Date(endDateStr) : new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "";

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth() + 1; // Include starting month

    if (months <= 0) {
      years--;
      months += 12;
    }

    if (months === 12) {
      years++;
      months = 0;
    }

    const parts = [];
    if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
    if (months > 0) parts.push(`${months} mo${months > 1 ? "s" : ""}`);
    if (parts.length === 0) parts.push("1 mo");
    return parts.join(" ");
  };

  const experienceFields = [
    { name: "role", label: "Role", required: true },
    { name: "company", label: "Company", required: true },
    { name: "location", label: "Location", required: false },
    { name: "logo", label: "Company Logo", type: "image", required: false },
    { name: "startDate", label: "Start Date", type: "date", required: true },
    { name: "endDate", label: "End Date", type: "date", required: false },
    { name: "type", label: "Type", type: "select", options: ["Full-time", "Part-time", "Self-employed", "Freelance", "Contract", "Internship", "Apprenticeship"], required: true },
    { name: "setup", label: "Setup", type: "select", options: ["Onsite", "Remote", "Hybrid"], required: true },
    { name: "responsibilities", label: "Responsibilities (semicolon-separated)", type: "array", separator: ";", placeholder: "e.g. Developed API; Maintained server; Design UI", required: false },
  ];

  const educationFields = [
    { name: "school", label: "School / University", required: true },
    { name: "degree", label: "Degree", required: true },
    { name: "major", label: "Major", required: true },
    { name: "logo", label: "School Logo", type: "image", required: false },
    { name: "startDate", label: "Start Date", type: "date", required: true },
    { name: "endDate", label: "End Date", type: "date", required: false },
    { name: "description", label: "Description", type: "textarea", required: false },
  ];

  const handleOpenAdd = (type) => {
    setModalType(type);
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e, type, item) => {
    e.preventDefault();
    e.stopPropagation();
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (e, type, id) => {
    e.preventDefault();
    e.stopPropagation();
    const table = type === "experience" ? "experiences" : "educations";
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      if (type === "experience") {
        setExperiences((prev) => prev.filter((item) => item.id !== id));
      } else {
        setEducations((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  };

  const handleSave = async (formData) => {
    const table = modalType === "experience" ? "experiences" : "educations";

    // Map camelCase to snake_case for DB
    const payload = modalType === "experience" ? {
      role: formData.role,
      company: formData.company,
      location: formData.location,
      logo: formData.logo,
      start_date: formData.startDate,
      end_date: formData.endDate || null,
      duration: calculateDuration(formData.startDate, formData.endDate),
      type: formData.type,
      setup: formData.setup,
      responsibilities: Array.isArray(formData.responsibilities) ? formData.responsibilities : [],
    } : {
      school: formData.school,
      degree: formData.degree,
      major: formData.major,
      logo: formData.logo,
      start_date: formData.startDate,
      end_date: formData.endDate,
      description: formData.description,
    };

    if (editingItem) {
      const { data, error } = await supabase
        .from(table)
        .update(payload)
        .eq("id", editingItem.id)
        .select();
      if (error) throw error;

      const returnedRow = (data && data.length > 0) ? data[0] : { ...editingItem, ...payload };
      const formatted = {
        ...returnedRow,
        startDate: returnedRow.start_date,
        endDate: returnedRow.end_date,
      };

      if (modalType === "experience") {
        setExperiences((prev) => {
          const updated = prev.map((item) => (item.id === editingItem.id ? formatted : item));
          return updated.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        });
      } else {
        setEducations((prev) => prev.map((item) => (item.id === editingItem.id ? formatted : item)));
      }
    } else {
      const insertPayload = { id: Date.now(), ...payload };
      const { data, error } = await supabase
        .from(table)
        .insert([insertPayload])
        .select();
      if (error) throw error;

      const returnedRow = (data && data.length > 0) ? data[0] : { ...insertPayload };
      const formatted = {
        ...returnedRow,
        startDate: returnedRow.start_date,
        endDate: returnedRow.end_date,
      };

      if (modalType === "experience") {
        setExperiences((prev) => {
          const updated = [...prev, formatted];
          return updated.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        });
      } else {
        setEducations((prev) => [...prev, formatted]);
      }
    }
  };

  // --- 2. Fetch Data Paralel ---
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        // Mengambil data dari 2 tabel secara bersamaan menggunakan Promise.all
        const [expResponse, eduResponse] = await Promise.all([supabase.from("experiences").select("*").order("start_date", { ascending: false }), supabase.from("educations").select("*").order("id", { ascending: true })]);

        // Cek jika ada error dari salah satu request
        if (expResponse.error) throw expResponse.error;
        if (eduResponse.error) throw eduResponse.error;

        // Mapping Data Experiences (snake_case -> camelCase)
        const formattedExperiences = expResponse.data.map((item) => ({
          ...item,
          startDate: item.start_date,
          endDate: item.end_date,
        }));

        // Mapping Data Educations (snake_case -> camelCase)
        const formattedEducations = eduResponse.data.map((item) => ({
          ...item,
          startDate: item.start_date,
          endDate: item.end_date,
        }));

        setExperiences(formattedExperiences);
        setEducations(formattedEducations);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // --- 3. Render Helper untuk Bagian Dinamis (Career & Education) ---
  const renderExperiences = () => {
    if (isLoading) return <div className="py-10 text-neutral-500 animate-pulse">Memuat riwayat karir...</div>;
    if (error) return <div className="py-10 text-red-500">Gagal memuat karir: {error}</div>;
    if (experiences.length === 0) return <div className="py-10 text-neutral-500">Belum ada data karir.</div>;

    return (
      <motion.div variants={parent} initial="hidden" animate="show" className="flex flex-col items-start space-y-4 w-full">
        {experiences.map((exp) => (
          <motion.div variants={child} key={exp.id} className="w-full">
            <ExperienceCard
              data={exp}
              onEdit={isAdmin ? (e) => handleOpenEdit(e, "experience", exp) : null}
              onDelete={isAdmin ? (e) => handleDelete(e, "experience", exp.id) : null}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderEducations = () => {
    if (isLoading) return <div className="py-10 text-neutral-500 animate-pulse">Memuat riwayat pendidikan...</div>;
    if (error) return <div className="py-10 text-red-500">Gagal memuat pendidikan: {error}</div>;
    if (educations.length === 0) return <div className="py-10 text-neutral-500">Belum ada data pendidikan.</div>;

    return (
      <div className="flex flex-col items-start space-y-4 w-full">
        {educations.map((edu) => (
          <EducationCard
            key={edu.id}
            data={edu}
            onEdit={isAdmin ? (e) => handleOpenEdit(e, "education", edu) : null}
            onDelete={isAdmin ? (e) => handleDelete(e, "education", edu.id) : null}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 px-4 lg:px-6">
      <SideNav />

      <motion.div animate={{ y: 0, opacity: 1 }} initial={{ y: 20, opacity: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="col-span-1 lg:col-span-9 w-full space-y-6 pb-16">
        {/* --- Bagian ABOUT (Statis) --- */}
        {/* Tidak dimasukkan ke loading state agar pengunjung langsung bisa membaca bio Anda saat web baru dibuka */}
        <section className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium tracking-tighter">About</h1>
          <span className="text-neutral-400 text-lg">A brief introduction to who I am.</span>
          <hr className="border-neutral-700 border-dashed my-2" />
          <div className="text-neutral-300 flex flex-col gap-6 text-lg mt-4">
            <p>
              I&apos;m Syahreza Satria, a Bandung-based Web Developer and UI Designer dedicated to building impactful digital solutions. I specialize in developing modern web platforms and mobile applications using a robust tech stack,
              including Laravel, React/Next.js (JavaScript), Tailwind CSS, and Flutter.{" "}
            </p>
            <p>
              My primary focus is crafting structured system architecture and clean, ultra-minimalist interface designs that align with business objectives. I believe that high-quality code must go hand-in-hand with logical clarity and an
              optimal user experience.
            </p>
            <p>
              I blend technical expertise with proactive communication, critical thinking, and effective time management. Drawing on my IT leadership experience, I thrive in collaborative environments and ensure every project is executed
              functionally and logically to deliver real-world impact.
            </p>
            <p>Best Regards,</p>
          </div>
        </section>

        <hr className="border-neutral-700" />

        {/* --- Bagian CAREER (Dinamis) --- */}
        <section className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
            <div className="space-y-2">
              <h2 className="text-2xl font-medium flex items-center gap-2 text-neutral-300">
                <PiBriefcase className="size-5" />
                Career
              </h2>
              <p className="text-neutral-400 text-lg">My work journey.</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => handleOpenAdd("experience")}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-lg shadow-emerald-600/10 active:scale-95"
              >
                <Plus className="size-4" />
                <span>Add Career</span>
              </button>
            )}
          </div>

          {renderExperiences()}
        </section>

        <hr className="border-neutral-700" />

        {/* --- Bagian EDUCATION (Dinamis) --- */}
        <section className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
            <div className="space-y-2">
              <h2 className="text-2xl font-medium flex items-center gap-2 text-neutral-300">
                <PiBriefcase className="size-5" />
                Education
              </h2>
              <p className="text-neutral-400 text-lg">My education journey.</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => handleOpenAdd("education")}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-lg shadow-emerald-600/10 active:scale-95"
              >
                <Plus className="size-4" />
                <span>Add Education</span>
              </button>
            )}
          </div>

          {renderEducations()}
        </section>

        <CrudModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? `Edit ${modalType === "experience" ? "Career" : "Education"}` : `Add ${modalType === "experience" ? "Career" : "Education"}`}
          onSubmit={handleSave}
          initialData={editingItem}
          fields={modalType === "experience" ? experienceFields : educationFields}
        />
      </motion.div>
    </div>
  );
}
