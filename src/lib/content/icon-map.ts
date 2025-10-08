import {
  Cable,
  Zap,
  CircuitBoard,
  Download,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  WrenchIcon as Wrench,
  ShieldCheck,
  Gauge,
  Ruler,
  ChevronRight,
  BookOpen,
  Cpu,
  Activity,
  Settings,
  Package,
  ArrowUpDown,
  Compass,
  Shield,
  Printer,
  ExternalLink,
  ClipboardCheck,
  HelpCircle,
  Play,
  Loader2,
  RotateCcw,
  type LucideIcon,
} from 'lucide-react'

// Icon name to component mapping
export const iconMap: Record<string, LucideIcon> = {
  cable: Cable,
  zap: Zap,
  'circuit-board': CircuitBoard,
  download: Download,
  'check-circle': CheckCircle,
  'alert-triangle': AlertTriangle,
  info: Info,
  'arrow-right': ArrowRight,
  wrench: Wrench,
  'shield-check': ShieldCheck,
  gauge: Gauge,
  ruler: Ruler,
  'chevron-right': ChevronRight,
  book: BookOpen,
  'book-open': BookOpen,
  cpu: Cpu,
  activity: Activity,
  settings: Settings,
  package: Package,
  'arrow-up-down': ArrowUpDown,
  compass: Compass,
  shield: Shield,
  printer: Printer,
  'external-link': ExternalLink,
  'clipboard-check': ClipboardCheck,
  'help-circle': HelpCircle,
  play: Play,
  loader: Loader2,
  'rotate-ccw': RotateCcw,
}

// Get icon component by name
export function getIcon(name: string): LucideIcon {
  return iconMap[name] || Info // Default to Info icon if not found
}

// Check if icon exists
export function hasIcon(name: string): boolean {
  return name in iconMap
}
