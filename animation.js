// animation.js

const parent = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.1, // Jauh lebih cepat
      staggerChildren: 0.15, // Jeda antar elemen lebih rapat
    },
  },
};

const child = {
  hidden: { opacity: 0, y: 15 }, // Jarak Y dikurangi agar masuknya lebih halus
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20, // Ditingkatkan agar tidak terlalu bouncy
      stiffness: 120, // Membuatnya terasa lebih responsif
    },
  },
};

export { parent, child };
