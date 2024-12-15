export interface UpdatePlugin {
  title: string
  info(): Promise<{ url: string; filename: string }>
}
