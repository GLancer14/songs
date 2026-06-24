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
  songs_artists: z.string().nonempty(),
  description: z.string().optional(),
  lyrics_translation_langs: z.array(z.string()).optional(),
  original: z.string().nonempty(),
  english: z.string().optional(),
  russian: z.string().optional(),
  people: z.array(z.string()).optional(),
  groupes: z.array(z.string()).optional(),
  orig_lang: z.string().optional(),
  genres: z.array(z.string()).optional(),
  albums: z.array(z.string()).optional(),
  mood: z.string().nonempty(),
  release_date: z.string().nonoptional(),
  bpm: z.string().optional(),
  track: z.string().optional(),
  title_image: z.file().optional(),
  orig_audio: z.file().optional(),
})

export type AddSongSchemaType = z.infer<typeof AddSongSchema>;

export const AddAlbumSchema = z.object({
  album_name: z.string().nonempty(),
  album_author: z.string().nonempty(),
  album_description: z.string().optional(),
  album_type: z.string().nonoptional(),
  release_date: z.string().nonoptional(),
  title_image: z.file().optional(),
})

export type AddAlbumSchemaType = z.infer<typeof AddAlbumSchema>;

export const AddGroupSchema = z.object({
  group_name: z.string().nonempty(),
  group_country: z.string().nonempty(),
  description: z.string().optional(),
  year_of_foundation: z.number().optional(),
  title_image: z.file().optional(),
})

export type AddGroupSchemaType = z.infer<typeof AddGroupSchema>;

export const AddPeopleSchema = z.object({
  people_name: z.string().nonempty(),
  people_firstname: z.string().optional(),
  people_surname: z.string().optional(),
  people_nickname: z.string().optional(),
  people_type: z.string().optional(),
  people_country: z.string().optional(),
  description: z.string().optional(),
  title_image: z.file().optional(),
})

export type AddPeopleSchemaType = z.infer<typeof AddPeopleSchema>;

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