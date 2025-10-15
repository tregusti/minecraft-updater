export interface Options {
  debug: boolean
  name?: string[]
  force: boolean
}

export interface UpdatePluginInfo {
  url: string
  filename: string
  changelog?: string
}

export interface UpdatePlugin {
  title: string
  fileStartsWith?: string
  info(): Promise<UpdatePluginInfo>
}

export type Nullable<T> = T | null
