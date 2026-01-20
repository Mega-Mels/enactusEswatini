import Link from 'next/link'
import Image from 'next/image'

type CourseCardProps = {
  id: string
  title: string
  description: string
  category: string
  thumbnail_url: string | null
  is_external: boolean
  is_certified: boolean
  enrollment_count: number
  resource_url?: string | null
}

export default function CourseCard({
  id,
  title,
  description,
  category,
  thumbnail_url,
  is_external,
  is_certified,
  enrollment_count,
  resource_url
}: CourseCardProps) {
  const defaultThumbnail = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop'

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:shadow-lg">
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <Image
          src={thumbnail_url || defaultThumbnail}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badges Overlay */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {is_certified && (
            <span className="rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              CERTIFIED
            </span>
          )}
          {is_external && (
            <span className="rounded-full bg-blue-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              EXTERNAL
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
          {category}
        </span>
        <h3 className="mb-2 line-clamp-1 text-xl font-bold text-slate-900">
          {title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-slate-600">
          {description}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
          

          {is_external && resource_url ? (
            <a
              href={resource_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-blue-600 hover:text-blue-800"
            >
              Go to Course →
            </a>
          ) : (
            <Link
              href={`/courses/${id}`}
              className="text-sm font-bold text-slate-900 hover:underline"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}