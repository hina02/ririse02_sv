import { writable } from 'svelte/store';
import { z } from 'zod';

export const Files = writable(z.array(String).parse([]));
