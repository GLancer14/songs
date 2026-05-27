import * as z from 'zod'
 
export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.email({ error: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { error: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
    .regex(/[0-9]/, { error: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      error: 'Contain at least one special character.',
    })
    .trim(),
})

export const SigninFormSchema = z.object({
  email: z.email({ error: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { error: 'Be at least 8 characters long' })
    .trim(),
})

export const AddSongSchema = z.object({
  songs_title: z.string().nonempty(),
  songs_name: z.string().nonempty(),
  songs_artist: z.string().nonempty(),
  description: z.string().optional(),
  lyrics_translation_langs: z.array(z.string()).optional(),
  original: z.string().nonempty(),
  english: z.string().optional(),
  russian: z.string().optional(),
  music_authors_nickname: z.array(z.string()).optional(),
  lyrics_authors_nickname: z.array(z.string()).optional(),
  singers_singer: z.array(z.string()).optional(),
  producers_producer: z.array(z.string()).optional(),
  groupes_grope_name: z.array(z.string()).optional(),
  original_languages: z.array(z.string()).optional(),
  genres_genre: z.array(z.string()).optional(),
  albums_title: z.array(z.string()).optional(),
  mood: z.string().nonempty(),
  release_date: z.date().nonoptional(),
  bpm: z.number().optional(),
  title_image: z.file().optional(),
  orig_audio: z.file().optional(),
})

export type AddSongSchemaType = z.infer<typeof AddSongSchema>;
 
export type FormState =
  {
    errors?: {
      name?: string[]
      email?: string[]
      password?: string[]
    }
    message?: string
  } | undefined;

export type FormStateSignIn =
{
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: string
} | undefined;