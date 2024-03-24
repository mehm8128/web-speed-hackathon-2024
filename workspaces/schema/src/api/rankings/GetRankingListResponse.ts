import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { author, book, image, ranking } from '../../models';

export const GetRankingListResponseSchema = createSelectSchema(ranking)
  .pick({
    id: true,
    rank: true,
  })
  .extend({
    book: createSelectSchema(book)
      .pick({
        description: true,
        id: true,
        name: true,
      })
      .extend({
        author: createSelectSchema(author)
          .pick({
            description: true,
            id: true,
            name: true,
          })
          .extend({
            image: createSelectSchema(image).pick({
              alt: true,
              id: true,
            }),
          }),
        image: createSelectSchema(image).pick({
          alt: true,
          id: true,
        }),
      }),
  })
  .array();

export type GetRankingListResponse = z.infer<typeof GetRankingListResponseSchema>;
