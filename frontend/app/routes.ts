import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/dashboard.tsx"),
  route("sholat", "routes/sholat.tsx"),
  route("puasa", "routes/puasa.tsx"),
  route("keuangan", "routes/keuangan.tsx"),
  route("olahraga", "routes/olahraga.tsx"),
  route("jurnal", "routes/jurnal.tsx"),
] satisfies RouteConfig;
