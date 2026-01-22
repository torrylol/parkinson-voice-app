import { Link } from 'react-router-dom'
import './ResourcePortal.css'
import { categories } from '../data/resources'

function ResourcePortal() {
  return (
    <div className="resource-portal">
      <header className="resource-portal-header">
        <h1>Ressurser</h1>
        <p className="resource-portal-subtitle">
          Tips og verktøy for å navigere den digitale hverdagen med Parkinson
        </p>
      </header>

      <main className="resource-portal-main">
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/kategori/${category.slug}`}
              className="category-card"
            >
              <span className="category-icon" aria-hidden="true">
                {category.icon}
              </span>
              <h2>{category.title}</h2>
              <p>{category.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default ResourcePortal
