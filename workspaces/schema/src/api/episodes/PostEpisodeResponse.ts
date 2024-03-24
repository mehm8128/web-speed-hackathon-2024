import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { episode, image } from '../../models';

export const PostEpisodeResponseSchema = createSelectSchema(episode)
  .pick({
    chapter: true,
    description: true,
    id: true,
    name: true,
    nameRuby: true,
  })
  .extend({
    image: createSelectSchema(image).pick({
      alt: true,
      id: true,
    }),
  });

export type PostEpisodeResponse = z.infer<typeof PostEpisodeResponseSchema>;
