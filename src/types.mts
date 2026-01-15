export interface Options {
  debug: boolean
  name?: string[]
  force: boolean
}

export interface UpdatePluginInfo {
  url: string
  fileBaseName: string
  version: string
  changelog?: string
}

export interface UpdatePlugin {
  title: string
  fileStartsWith?: string
  /** If this plugin need a special version extraction function */
  extractVersion?: (name: string) => string | null
  info(): Promise<UpdatePluginInfo>
}

export type Nullable<T> = T | null
