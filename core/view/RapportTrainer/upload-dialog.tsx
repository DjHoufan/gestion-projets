"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Upload, X, FileText, Calendar, Hash } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form"

// Schéma DocumentSchema
const DocumentSchema = z.instanceof(File, {
  message: "Un fichier est requis.",
})

// Schéma principal
const UploadSchema = z.object({
  id: z
    .string()
    .uuid({ message: "L'identifiant doit être un UUID valide." })
    .optional(),
  titre: z
    .string({
      required_error: "Le titre est requis.",
      invalid_type_error: "Le titre doit être une chaîne de caractères.",
    })
    .min(1, { message: "Le titre ne peut pas être vide." }),
  date: z.coerce.date({
    required_error: "La date est requise.",
    invalid_type_error: "La date doit être une date valide.",
  }),
  file: DocumentSchema,
})

export type UploadSchemaInput = z.input<typeof UploadSchema>

interface UploadDialogProps {
  trigger?: React.ReactNode
}

export default function UploadDialog({ trigger }: UploadDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const form = useForm<UploadSchemaInput>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      titre: "",
      date: new Date(),
    },
  })

  const onSubmit = async (data: UploadSchemaInput) => {
    try {
 
      // Créer FormData pour l'upload de fichier
      const formData = new FormData()
      if (data.id) formData.append("id", data.id)
      formData.append("titre", data.titre)
      formData.append("date", data.date.toISOString())
      formData.append("file", data.file)

      // Simulation d'upload
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Succès
      setOpen(false)
      form.reset()
      setSelectedFile(null)
      
      // Notification de succès (vous pouvez utiliser toast ici)
      alert("Document uploadé avec succès !")
    } catch (error) {
      alert("Erreur lors de l'upload du document")
    }
  }

  const defaultTrigger = (
    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
      <Upload className="w-4 h-4 mr-2" />
      Uploader un document
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 border-b">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
              <Upload className="w-6 h-6 text-emerald-600" />
              Nouveau Document
            </DialogTitle>
            <DialogDescription className="text-emerald-700">
              Remplissez les informations et sélectionnez votre fichier
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Champ ID (optionnel) */}
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                      <Hash className="w-4 h-4 text-emerald-600" />
                      Identifiant (optionnel)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="UUID (ex: 123e4567-e89b-12d3-a456-426614174000)"
                        className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Champ Titre */}
              <FormField
                control={form.control}
                name="titre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      Titre *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le titre du document"
                        className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Champ Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      Date *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                        {...field}
                        value={field.value instanceof Date 
                          ? field.value.toISOString().split('T')[0] 
                          : field.value
                        }
                        onChange={(e) => {
                          const date = new Date(e.target.value)
                          field.onChange(date)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Champ Fichier */}
              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange, name } }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                      <Upload className="w-4 h-4 text-emerald-600" />
                      Fichier *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="file"
                          name={name}
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                          className="border-2 border-dashed border-emerald-200 hover:border-emerald-300 focus:border-emerald-500 p-4 h-auto cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              onChange(file)
                              setSelectedFile(file)
                            }
                          }}
                        />
                        {selectedFile && (
                          <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-emerald-600" />
                              <span className="text-sm text-emerald-800 font-medium">
                                {selectedFile.name}
                              </span>
                              <span className="text-xs text-emerald-600">
                                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedFile(null)
                                onChange(undefined)
                              }}
                              className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Boutons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset()
                    setSelectedFile(null)
                  }}
                  className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Réinitialiser
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Upload en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Uploader
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
