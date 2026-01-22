import { useParams, Link } from 'react-router-dom'
import './ResourcePage.css'
import { getResource, getCategory } from '../data/resources'
import BackButton from '../components/BackButton'

function ResourcePage() {
  const { slug } = useParams()
  const resource = getResource(slug)

  if (!resource) {
    return (
      <div className="resource-page">
        <BackButton to="/ressurser" />
        <div className="resource-not-found">
          <h1>Ressurs ikke funnet</h1>
          <p>Vi fant ikke ressursen du leter etter.</p>
          <Link to="/ressurser" className="back-link">
            Tilbake til ressurser
          </Link>
        </div>
      </div>
    )
  }

  const category = getCategory(resource.category)

  // Simple markdown-like rendering
  const renderContent = (content) => {
    const lines = content.trim().split('\n')
    const elements = []
    let currentList = []
    let listKey = 0

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${listKey++}`} className="resource-list">
            {currentList.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )
        currentList = []
      }
    }

    lines.forEach((line, index) => {
      const trimmed = line.trim()

      if (trimmed.startsWith('## ')) {
        flushList()
        elements.push(
          <h2 key={index} className="resource-h2">
            {trimmed.substring(3)}
          </h2>
        )
      } else if (trimmed.startsWith('### ')) {
        flushList()
        elements.push(
          <h3 key={index} className="resource-h3">
            {trimmed.substring(4)}
          </h3>
        )
      } else if (trimmed.startsWith('- ')) {
        currentList.push(renderInlineFormatting(trimmed.substring(2)))
      } else if (trimmed === '') {
        flushList()
      } else if (trimmed) {
        flushList()
        elements.push(
          <p key={index} className="resource-p">
            {renderInlineFormatting(trimmed)}
          </p>
        )
      }
    })

    flushList()
    return elements
  }

  // Handle bold text with **text**
  const renderInlineFormatting = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  return (
    <div className="resource-page">
      <BackButton to={`/kategori/${resource.category}`} />

      <article className="resource-article">
        <header className="resource-header">
          {category && (
            <Link to={`/kategori/${category.slug}`} className="resource-category-link">
              {category.icon} {category.title}
            </Link>
          )}
          <h1>{resource.title}</h1>
          {resource.forCaregivers && (
            <span className="caregiver-tag-large">Inneholder tips for pårørende</span>
          )}
        </header>

        <div className="resource-content">
          {renderContent(resource.content)}
        </div>
      </article>
    </div>
  )
}

export default ResourcePage
