import { writable } from "svelte/store";
import type { Area } from "$lib/types/areas";

export const listaAreas = writable<Area[]>([]);
