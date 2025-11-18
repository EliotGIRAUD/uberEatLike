import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async () => {
  try {
    const filePath = join(process.cwd(), 'public', 'restaurant.json')
    const data = await readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Erreur lecture restaurant.json:', error)
    return []
  }
})

