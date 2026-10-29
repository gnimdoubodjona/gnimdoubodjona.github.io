/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Génère un site 100 % statique dans /out, hébergeable sur GitHub Pages
  output: "export",
  images: {
    // GitHub Pages n'a pas de serveur pour optimiser les images à la volée
    unoptimized: true,
  },
};

export default nextConfig;
