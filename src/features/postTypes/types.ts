import type { ComponentType, SVGProps } from 'react'

export type PostTypeId = 'youtube' | 'website'

export type VariableKind = 'text' | 'textarea' | 'url'

export interface VariableDef {
  key: string
  label: string
  kind: VariableKind
  required?: boolean
  maxLength?: number
  placeholder?: string
  helpText?: string
  autoFilled?: boolean
}

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

export interface PostType {
  id: PostTypeId
  label: string
  description: string
  icon: IconComponent
  variables: VariableDef[]
  defaultTemplateId: string
  supportsDataSource: boolean
}

export type VariableValues = Record<string, string>
