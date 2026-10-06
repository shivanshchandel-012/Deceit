/** Generate a report from the metadata used by the DECEIT web app. */
import fs from 'node:fs'
import path from 'node:path'
import { APP_CONFIG } from './packages/config/src/index'

interface SeoReport {
  generatedAt: string
  status: 'READY_FOR_REVIEW' | 'NEEDS_REVIEW'
  source: string
  metadata: {
    title: string
    description: string
    descriptionLength: number
    keywords: string[]
    canonicalUrl: string
  }
  structuredData: Record<string, string>
  validation: {
    errors: string[]
  }
}

function runSeoGenerator(): SeoReport {
  const errors: string[] = []
  const title = APP_CONFIG.seo.title
  const description = APP_CONFIG.description
  const keywords = [...APP_CONFIG.seo.keywords]

  if (!title.trim() || title.length > 60) {
    errors.push('Title must contain 1 to 60 characters.')
  }
  if (description.length < 50 || description.length > 170) {
    errors.push('Description should contain 50 to 170 characters.')
  }
  if (keywords.length === 0) {
    errors.push('At least one keyword is required.')
  }

  let canonicalUrl: string
  try {
    canonicalUrl = new URL(APP_CONFIG.homepage).toString()
  } catch {
    canonicalUrl = APP_CONFIG.homepage
    errors.push('APP_CONFIG.homepage must be a valid URL.')
  }

  const report: SeoReport = {
    generatedAt: new Date().toISOString(),
    status: errors.length === 0 ? 'READY_FOR_REVIEW' : 'NEEDS_REVIEW',
    source: 'packages/config/src/index.ts',
    metadata: {
      title,
      description,
      descriptionLength: description.length,
      keywords,
      canonicalUrl,
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: APP_CONFIG.name,
      description,
      url: canonicalUrl,
      applicationCategory: 'GameApplication',
      operatingSystem: 'Web browser',
      keywords: keywords.join(', '),
    },
    validation: { errors },
  }

  const outputDir = path.join(__dirname, 'docs', 'seo')
  fs.mkdirSync(outputDir, { recursive: true })
  const outputPath = path.join(outputDir, 'seo-manifest.json')
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf-8')

  console.log(`SEO report: ${outputPath}`)
  console.log(`Status: ${report.status}`)
  if (errors.length > 0) {
    errors.forEach((error) => console.error(`- ${error}`))
  }

  return report
}

const report = runSeoGenerator()
if (report.status === 'NEEDS_REVIEW') {
  process.exitCode = 1
}
