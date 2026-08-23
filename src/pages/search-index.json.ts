import type { APIRoute } from "astro";
import { consumables } from "@/data/consumables";
import { models } from "@/data/models";
import { createAutocompleteIndex } from "@/utils/autocomplete";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(JSON.stringify(createAutocompleteIndex(models, consumables)), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
