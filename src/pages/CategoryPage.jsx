import { useParams, Link } from 'react-router-dom'
import './CategoryPage.css'
import { getCategory, getResourcesByCategory } from '../data/resources'
import BackButton from '../components/BackButton'

function CategoryPage() {
  const { slug } = useParams()
  const category = getCategory(slug)
  const resources = getResourcesByCategory(slug)

  if (!category) {
    return (
      <div className="category-page">
        <BackButton to="/ressurser" />
        <div className="category-not-found">
          <h1>Kategori ikke funnet</h1>
          <p>Vi fant ikke kategorien du leter etter.</p>
          <Link to="/ressurser" className="back-link">
            Tilbake til ressurser
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="category-page">
      <BackButton to="/ressurser" />

      <header className="category-page-header">
        <span className="category-page-icon" aria-hidden="true">
          {category.icon}
        </span>
        <h1>{category.title}</h1>
        <p className="category-page-description">{category.description}</p>
      </header>

      <main className="category-page-main">
        {resources.length === 0 ? (
          <p className="no-resources">Ingen ressurser ennå i denne kategorien.</p>
        ) : (
          <div className="resource-list">
            {resources.map((resource) => (
              <Link
                key={resource.slug}
                to={`/ressurs/${resource.slug}`}
                className="resource-card"
              >
                <h2>{resource.title}</h2>
                <p>{resource.description}</p>
                {resource.forCaregivers && (
                  <span className="caregiver-tag">Tips for pårørende</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default CategoryPage
