'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import CourseCard from '@/components/courses/CourseCard'

type Course = {
  id: string
  title: string
  description: string
  category: string
  thumbnail_url: string | null
  is_external: boolean
  is_certified: boolean
  enrollment_count: number
  resource_url: string | null
}

export default function LearningPage() {
  const [courses, setCourses] = useState<Course[]>([]) // Added Type
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const supabase = createClient()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCourses(data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', 'Technical', 'Business', 'Soft Skills', 'Data Analytics']

  const filteredCourses = activeCategory === 'all'
    ? courses
    : courses.filter(c => c.category === activeCategory)

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Enactus Remote Academy
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Enhance your profile with industry-recognized certifications and skills.
          </p>
        </header>

        {/* Category Filter */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Filter by Category
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {category === 'all' ? 'All Courses' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-xl text-gray-500">No courses found in this category.</p>
            <button 
              onClick={() => setActiveCategory('all')}
              className="mt-4 text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {!loading && (
          <footer className="mt-16 border-t border-gray-200 pt-8 text-center">
            <p className="text-sm text-gray-500">
              <span className="font-bold text-gray-900">{courses.length}</span> courses available • {' '}
              <span className="font-bold text-gray-900">
                {courses.reduce((sum, c) => sum + c.enrollment_count, 0).toLocaleString()}
              </span> total enrollments
            </p>
          </footer>
        )}
      </div>
    </div>
  )
}