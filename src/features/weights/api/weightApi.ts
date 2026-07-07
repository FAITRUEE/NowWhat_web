import { apiClient } from '@/api/client'

export interface WeightPercentages {
  urgencyWeight: number
  importanceWeight: number
  effortWeight: number
}

interface WeightDecimals {
  urgencyWeight: number
  importanceWeight: number
  effortWeight: number
}

function toPercentages(decimals: WeightDecimals): WeightPercentages {
  return {
    urgencyWeight: Math.round(decimals.urgencyWeight * 100),
    importanceWeight: Math.round(decimals.importanceWeight * 100),
    effortWeight: Math.round(decimals.effortWeight * 100),
  }
}

function toDecimals(percentages: WeightPercentages): WeightDecimals {
  return {
    urgencyWeight: percentages.urgencyWeight / 100,
    importanceWeight: percentages.importanceWeight / 100,
    effortWeight: percentages.effortWeight / 100,
  }
}

export const weightApi = {
  get: () => apiClient.get<WeightDecimals>('/users/weights').then((res) => toPercentages(res.data)),

  update: (weights: WeightPercentages) =>
    apiClient
      .put<WeightDecimals>('/users/weights', toDecimals(weights))
      .then((res) => toPercentages(res.data)),
}
