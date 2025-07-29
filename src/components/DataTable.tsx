import React, { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'

interface Column<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  pageSize?: number
  loading?: boolean
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  pageSize = 10,
  loading = false,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = searchable
    ? data.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = sortConfig.key.includes('.')
        ? sortConfig.key
            .split('.')
            .reduce((obj, key) => obj?.[key], a)
        : a[sortConfig.key]
      const bValue = sortConfig.key.includes('.')
        ? sortConfig.key
            .split('.')
            .reduce((obj, key) => obj?.[key], b)
        : b[sortConfig.key]

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [filteredData, sortConfig])

  const totalPages = Math.ceil(sortedData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = sortedData.slice(
    startIndex,
    startIndex + pageSize
  )

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        if (current.direction === 'asc') {
          return { key, direction: 'desc' }
        } else {
          return null
        }
      } else {
        return { key, direction: 'asc' }
      }
    })
  }

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="w-4 h-4" />
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    )
  }

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {searchable && (
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2
                         border border-gray-600
                         rounded-lg
                         text-gray-900 placeholder-gray-700
                         focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.sortable ? (
                    <button
                      onClick={() =>
                        handleSort(String(column.key))
                      }
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>{column.label}</span>
                      {getSortIcon(String(column.key))}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center"
                >
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  Nenhum resultado encontrado
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.render
                        ? column.render(item)
                        : String(
                            getNestedValue(
                              item,
                              String(column.key)
                            ) || '-'
                          )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {startIndex + 1} a{' '}
            {Math.min(startIndex + pageSize, sortedData.length)} de{' '}
            {sortedData.length} resultados
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
              className="px-3 py-1
                         border border-gray-600
                         rounded-md
                         text-gray-900
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                const distance = Math.abs(page - currentPage)
                return (
                  distance === 0 ||
                  distance === 1 ||
                  page === 1 ||
                  page === totalPages
                )
              })
              .map((page, idx, array) => (
                <React.Fragment key={page}>
                  {idx > 0 &&
                    array[idx - 1] !== page - 1 && (
                      <span className="px-2 text-gray-500">
                        ...
                      </span>
                    )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded-md ${
                      currentPage === page
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'border-gray-600 text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1
                         border border-gray-600
                         rounded-md
                         text-gray-900
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:bg-gray-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
