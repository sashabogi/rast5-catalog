/**
 * Types for Connector Selection Wizard
 */

export type ApplicationType = 'wire-to-wire' | 'wire-to-board' | 'board-to-board' | null
export type Orientation = 'horizontal' | 'vertical' | 'either' | null

export interface WizardState {
  applicationType: ApplicationType
  poleCount: number | null
  orientation: Orientation
  requiresLocking: boolean
  specialVersion: boolean
  specificKeying: boolean
}

export interface ConnectorResults {
  sockets: Array<{
    id: string
    model: string
    display_name?: string
    gender: string
    pole_count: number
    orientation?: string
    is_special_version?: boolean
    video_360_url: string
  }>
  tabs: Array<{
    id: string
    model: string
    display_name?: string
    gender: string
    pole_count: number
    orientation?: string
    is_special_version?: boolean
    video_360_url: string
  }>
  headers: Array<{
    id: string
    model: string
    display_name?: string
    gender: string
    pole_count: number
    orientation?: string
    is_special_version?: boolean
    video_360_url: string
  }>
}

export interface WizardStepConfig {
  id: string
  title: string
  description?: string
  isValid: (state: WizardState) => boolean
}
