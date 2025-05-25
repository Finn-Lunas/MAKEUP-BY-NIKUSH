export const dynamic = "force-static"; // ✨ дозволяє статично зібрати сторінку, попри useRouter / headers

import { redirect } from "next/navigation";

export default function Page() {
  redirect("/uk/");
}
