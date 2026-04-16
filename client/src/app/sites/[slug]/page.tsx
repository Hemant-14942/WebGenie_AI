"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { serverUrl } from "@/helpers/constants";

type DeployedWebsite = {
  title: string;
  code: string;
  slug: string;
  updatedAt: string;
};

export default function PublicSitePage() {
  const { slug } = useParams<{ slug: string }>();
  const [website, setWebsite] = useState<DeployedWebsite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/sites/${slug}`);
        setWebsite(res.data?.website ?? null);
      } catch (err) {
        console.error(err);
        setError("Website not found.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white grid place-items-center">
        Loading deployed website...
      </main>
    );
  }

  if (error || !website) {
    return (
      <main className="min-h-screen bg-black text-white grid place-items-center">
        {error ?? "Website not found."}
      </main>
    );
  }

  return (
    <main className="h-screen w-screen bg-black">
      <iframe
        title={website.title || "Deployed website"}
        className="h-full w-full border-0 bg-white"
        sandbox="allow-same-origin allow-scripts allow-forms"
        srcDoc={website.code}
      />
    </main>
  );
}