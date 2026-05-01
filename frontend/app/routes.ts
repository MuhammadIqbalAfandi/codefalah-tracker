import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/dashboard.tsx"),
  route("sholat", "routes/sholat.tsx"),
  route("sholat/:id", "routes/sholat-detail.tsx"),
  route("puasa", "routes/puasa.tsx"),
  route("puasa/:id", "routes/puasa-detail.tsx"),
  route("keuangan", "routes/keuangan.tsx"),
  route("keuangan/:id", "routes/keuangan-detail.tsx"),
  route("olahraga", "routes/olahraga.tsx"),
  route("olahraga/:id", "routes/olahraga-detail.tsx"),
  route("jurnal", "routes/jurnal.tsx"),
  route("jurnal/:id", "routes/jurnal-detail.tsx"),
] satisfies RouteConfig;
