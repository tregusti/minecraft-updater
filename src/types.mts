export interface Options {
  debug: boolean
  name?: string[]
  force: boolean
}

export interface UpdatePlugin {
  title: string
  info(): Promise<{ url: string; filename: string }>
}

export type Nullable<T> = T | null
