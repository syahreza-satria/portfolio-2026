"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

const ContactForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwpSZxElX1JdSuiTliZ_BNamS0b_HxgrXMwav9NfB-GIUF4J8STAX6sHC6URgdy4onJmQ/exec";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target;
    const formData = new FormData(form);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });

      setIsSuccess(true);
      form.reset();

      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-4 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-neutral-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="John Doe"
              className="bg-neutral-900/50 border border-neutral-700/50 text-neutral-200 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 block w-full p-3 transition-all outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-neutral-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="john@example.com"
              className="bg-neutral-900/50 border border-neutral-700/50 text-neutral-200 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 block w-full p-3 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-sm font-medium text-neutral-300">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows="4"
            placeholder="Tulis pesan Anda di sini..."
            className="bg-neutral-900/50 border border-neutral-700/50 text-neutral-200 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 block w-full p-3 transition-all outline-none resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isLoading || isSuccess}
          className={`mt-2 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
            isSuccess ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="size-4" />
              Message Sent!
            </>
          ) : (
            <>
              Send Message
              <Send className="size-4" />
            </>
          )}
        </button>
      </form>
    </section>
  );
};

export default ContactForm;
