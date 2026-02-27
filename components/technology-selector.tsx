"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, Code, Database, Globe, Smartphone } from "lucide-react"

interface TechnologySelectorProps {
  label: string
  value: string[]
  onChange: (technologies: string[]) => void
  disabled?: boolean
  maxTechnologies?: number
}

// Tecnologías predefinidas organizadas por categoría
const PREDEFINED_TECHNOLOGIES = {
  frontend: {
    icon: Globe,
    color: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700",
    technologies: [
      "React",
      "Next.js",
      "Vue.js",
      "Angular",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Bootstrap",
      "Sass",
      "Material-UI",
      "Chakra UI",
      "Styled Components",
    ],
  },
  backend: {
    icon: Database,
    color:
      "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700",
    technologies: [
      "Node.js",
      "Express",
      "Nest.js",
      "Python",
      "Django",
      "Flask",
      "PHP",
      "Laravel",
      "Java",
      "Spring Boot",
      "C#",
      ".NET",
      "Ruby on Rails",
      "Go",
    ],
  },
  database: {
    icon: Database,
    color:
      "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-700",
    technologies: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Firebase",
      "Supabase",
      "Redis",
      "SQLite",
      "MariaDB",
      "Elasticsearch",
      "DynamoDB",
      "Prisma",
      "TypeORM",
    ],
  },
  mobile: {
    icon: Smartphone,
    color:
      "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-700",
    technologies: ["React Native", "Flutter", "Ionic", "Xamarin", "Swift", "Kotlin", "Cordova", "Expo"],
  },
  tools: {
    icon: Code,
    color: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700",
    technologies: [
      "Git",
      "Docker",
      "Kubernetes",
      "AWS",
      "Vercel",
      "Netlify",
      "Heroku",
      "GitHub Actions",
      "Jenkins",
      "Webpack",
      "Vite",
      "ESLint",
      "Prettier",
      "Jest",
    ],
  },
}

export function TechnologySelector({
  label,
  value = [],
  onChange,
  disabled = false,
  maxTechnologies = 10,
}: TechnologySelectorProps) {
  const [customTech, setCustomTech] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Agregar tecnología
  const addTechnology = useCallback(
    (tech: string) => {
      const trimmedTech = tech.trim()
      if (trimmedTech && !value.includes(trimmedTech) && value.length < maxTechnologies) {
        onChange([...value, trimmedTech])
      }
    },
    [value, onChange, maxTechnologies],
  )

  // Remover tecnología
  const removeTechnology = useCallback(
    (tech: string) => {
      onChange(value.filter((t) => t !== tech))
    },
    [value, onChange],
  )

  // Agregar tecnología personalizada
  const handleAddCustom = useCallback(() => {
    if (customTech.trim()) {
      addTechnology(customTech)
      setCustomTech("")
    }
  }, [customTech, addTechnology])

  // Manejar Enter en input personalizado
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        handleAddCustom()
      }
    },
    [handleAddCustom],
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>{label}</Label>
        <span className="text-xs text-muted-foreground">
          {value.length} / {maxTechnologies} tecnologías
        </span>
      </div>

      {/* Tecnologías seleccionadas */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
          {value.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="flex items-center gap-1 bg-brand-100 text-brand-800 border-brand-300 dark:bg-brand-900/20 dark:text-brand-400 dark:border-brand-700"
            >
              {tech}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTechnology(tech)}
                  className="ml-1 hover:bg-brand-200 dark:hover:bg-brand-800 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* Input para tecnología personalizada */}
      <div className="flex gap-2">
        <Input
          value={customTech}
          onChange={(e) => setCustomTech(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Agregar tecnología personalizada..."
          disabled={disabled || value.length >= maxTechnologies}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAddCustom}
          disabled={disabled || !customTech.trim() || value.length >= maxTechnologies}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Categorías de tecnologías predefinidas */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Tecnologías populares:</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(PREDEFINED_TECHNOLOGIES).map(([categoryKey, category]) => {
            const IconComponent = category.icon
            const isActive = activeCategory === categoryKey

            return (
              <Card
                key={categoryKey}
                className={`cursor-pointer transition-all duration-200 ${
                  isActive ? "ring-2 ring-brand-500 shadow-md" : "hover:shadow-sm"
                }`}
                onClick={() => setActiveCategory(isActive ? null : categoryKey)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 capitalize">
                    <IconComponent className="h-4 w-4" />
                    {categoryKey === "tools" ? "Herramientas" : categoryKey}
                  </CardTitle>
                </CardHeader>
                {isActive && (
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1">
                      {category.technologies.map((tech) => {
                        const isSelected = value.includes(tech)
                        const canAdd = !isSelected && value.length < maxTechnologies

                        return (
                          <button
                            key={tech}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (isSelected) {
                                removeTechnology(tech)
                              } else if (canAdd) {
                                addTechnology(tech)
                              }
                            }}
                            disabled={disabled || (!isSelected && !canAdd)}
                            className={`text-xs px-2 py-1 rounded-full border transition-all duration-200 ${
                              isSelected
                                ? "bg-brand-500 text-white border-brand-500 hover:bg-brand-600"
                                : canAdd
                                  ? `${category.color} hover:scale-105 hover:shadow-sm`
                                  : "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
                            }`}
                          >
                            {isSelected && <span className="mr-1">✓</span>}
                            {tech}
                          </button>
                        )
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      {/* Mensaje de límite */}
      {value.length >= maxTechnologies && (
        <p className="text-xs text-yellow-600 dark:text-yellow-400">
          Has alcanzado el límite máximo de {maxTechnologies} tecnologías.
        </p>
      )}
    </div>
  )
}
