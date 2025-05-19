import type { LazyExoticComponent } from "react"

export interface Route {
  path: string
  component: LazyExoticComponent<() => any>
}
