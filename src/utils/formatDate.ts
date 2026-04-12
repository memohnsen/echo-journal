import { format, parse } from 'date-fns'

// Outputs "Feb 10, 2026"
export const formatDate = (date: string): string => {
  const formatString = 'yyyy-MM-dd'
  const baseDate = new Date()

  const dateObject = parse(date, formatString, baseDate)

  const formattedOutput = format(dateObject, 'MMM dd, yyyy')

  return formattedOutput
}

// Outputs "2026-02-10"
export const formatDateToDatabase = (date: string): string => {
  const formatString = 'MM/dd/yyyy'
  const baseDate = new Date()

  const dateObject = parse(date, formatString, baseDate)

  const formattedOutput = format(dateObject, 'yyyy-MM-dd')

  return formattedOutput
}

// Outputs Date Object Tue Feb 10 2026 00:00:00 GMT+
export const formatStringToDate = (date: string): Date => {
  const formatString = 'yyyy-MM-dd'
  const baseDate = new Date()

  const dateObject = parse(date, formatString, baseDate)

  return dateObject
}
