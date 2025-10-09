'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { WizardState, ConnectorResults } from '@/types/wizard.types'

const TOTAL_STEPS = 5

export function useConnectorWizard() {
  const [step, setStep] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [results, setResults] = useState<ConnectorResults>({ sockets: [], tabs: [], headers: [] })
  const [wizardState, setWizardState] = useState<WizardState>({
    applicationType: null,
    poleCount: null,
    orientation: null,
    requiresLocking: false,
    specialVersion: false,
    specificKeying: false
  })

  const progress = (step / TOTAL_STEPS) * 100

  // Check if current step is valid
  const isStepValid = (): boolean => {
    switch (step) {
      case 1:
        return wizardState.applicationType !== null
      case 2:
        return wizardState.poleCount !== null
      case 3:
        return wizardState.orientation !== null
      case 4:
        return true // Optional step, always valid
      default:
        return true
    }
  }

  // Fetch results based on wizard selections
  const fetchResults = async () => {
    setLoading(true)
    try {
      const { poleCount, orientation, applicationType } = wizardState

      // Build base query
      let socketQuery = supabase
        .from('connectors')
        .select('*')
        .eq('gender', 'Female')
        .eq('pole_count', poleCount!)
        .order('model')

      let tabQuery = supabase
        .from('connectors')
        .select('*')
        .eq('gender', 'Male')
        .eq('pole_count', poleCount!)
        .order('model')

      let headerQuery = supabase
        .from('connectors')
        .select('*')
        .eq('gender', 'PCB')
        .eq('pole_count', poleCount!)
        .order('model')

      // Apply orientation filter
      if (orientation && orientation !== 'either') {
        const orientationValue = orientation.charAt(0).toUpperCase() + orientation.slice(1)
        socketQuery = socketQuery.eq('orientation', orientationValue)
        tabQuery = tabQuery.eq('orientation', orientationValue)
        headerQuery = headerQuery.eq('orientation', orientationValue)
      }

      // Apply special version filter
      if (wizardState.specialVersion) {
        socketQuery = socketQuery.eq('is_special_version', true)
        tabQuery = tabQuery.eq('is_special_version', true)
        headerQuery = headerQuery.eq('is_special_version', true)
      }

      // Fetch based on application type
      type ConnectorData = {
        id: string
        model: string
        display_name?: string
        gender: string
        pole_count: number
        orientation?: string
        is_special_version?: boolean
        video_360_url: string
      }

      let sockets: ConnectorData[] = []
      let tabs: ConnectorData[] = []
      let headers: ConnectorData[] = []

      switch (applicationType) {
        case 'wire-to-wire':
          const [socketResult, tabResult] = await Promise.all([
            socketQuery,
            tabQuery
          ])
          sockets = socketResult.data || []
          tabs = tabResult.data || []
          break

        case 'wire-to-board':
          const [socketResult2, headerResult] = await Promise.all([
            socketQuery,
            headerQuery
          ])
          sockets = socketResult2.data || []
          headers = headerResult.data || []
          break

        case 'board-to-board':
          const headerResult2 = await headerQuery
          headers = headerResult2.data || []
          break
      }

      setResults({ sockets, tabs, headers })
    } catch (error) {
      console.error('Error fetching connectors:', error)
    } finally {
      setLoading(false)
    }
  }

  // Navigate to next step
  const handleNext = async () => {
    if (!isStepValid()) return

    if (step < TOTAL_STEPS) {
      if (step === 4) {
        // Before moving to results, fetch data
        await fetchResults()
      }
      setStep(step + 1)
    }
  }

  // Navigate to previous step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  // Reset wizard
  const handleReset = () => {
    setWizardState({
      applicationType: null,
      poleCount: null,
      orientation: null,
      requiresLocking: false,
      specialVersion: false,
      specificKeying: false
    })
    setStep(1)
    setResults({ sockets: [], tabs: [], headers: [] })
  }

  // Update wizard state
  const updateState = (updates: Partial<WizardState>) => {
    setWizardState(prev => ({ ...prev, ...updates }))
  }

  return {
    step,
    progress,
    totalSteps: TOTAL_STEPS,
    loading,
    results,
    wizardState,
    isStepValid,
    handleNext,
    handleBack,
    handleReset,
    updateState
  }
}
