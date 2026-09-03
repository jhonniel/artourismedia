import { useMutation } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'
import type { ContactFormData, NewsletterFormData } from '@/types'

export function useContactMutation() {
  return useMutation({
    mutationFn: (data: ContactFormData) => endpoints.contact(data),
  })
}

export function useNewsletterMutation() {
  return useMutation({
    mutationFn: (data: NewsletterFormData) => endpoints.newsletter(data),
  })
}
