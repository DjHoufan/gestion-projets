"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/core/components/ui/button"
import { Loader2, Trash2, Heart, AlertTriangle } from "lucide-react"

interface DeleteConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
  title?: string
  confirmText?: string
  cancelText?: string
}

export const DeleteConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title,
  confirmText = "Supprimer",
  cancelText = "Annuler",
}: DeleteConfirmationProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    if (isOpen) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isMounted) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop doux */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 bg-black/10 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal principale */}
          <motion.div
            className="relative z-10 w-full max-w-md"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 400,
              duration: 0.3,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Container principal */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Header coloré avec dégradé doux */}
              <div className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 px-8 pt-8 pb-6">
                {/* Motif décoratif en arrière-plan */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-pink-200/40 to-rose-200/40 rounded-full blur-xl" />
                  <div className="absolute bottom-2 left-6 w-16 h-16 bg-gradient-to-br from-orange-200/40 to-yellow-200/40 rounded-full blur-lg" />
                </div>

                {/* Icône principale avec animation douce */}
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 300,
                    delay: 0.1,
                  }}
                  className="relative flex justify-center mb-4"
                >
                  <div className="relative">
                    {/* Cercle de fond avec animation de respiration */}
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                      className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Trash2 className="h-7 w-7 text-rose-500" />
                    </motion.div>

                    {/* Petits cœurs flottants */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        style={{
                          top: "50%",
                          left: "50%",
                          transform: `rotate(${i * 120}deg) translateY(-30px)`,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 0.6, 0],
                          scale: [0, 1, 0],
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.7,
                          ease: "easeInOut",
                        }}
                      >
                        <Heart className="h-3 w-3 text-pink-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Titre élégant */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="text-xl font-semibold text-gray-800 text-center mb-2"
                >
                  Confirmer la suppression
                </motion.h2>

                {/* Sous-titre doux */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="flex items-center justify-center gap-2 text-gray-500"
                >
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="text-sm">Action irréversible</span>
                </motion.div>
              </div>

              {/* Contenu principal */}
              <div className="px-8 py-6">
                {/* Message principal */}
                   <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="text-gray-600 text-center mb-8 leading-relaxed"
                  >
                    Êtes-vous certain de vouloir supprimer{" "}
                    <span className="font-medium text-gray-800 bg-gray-100 px-2 py-1 rounded-lg">
                      {title}
                    </span>
                    ?
                    <br />
                    Cette action ne pourra pas être annulée.
                  </motion.p>

                {/* Boutons avec animations douces */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="flex gap-3"
                >
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 rounded-xl h-12"
                  >
                    <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="font-medium">
                      {cancelText}
                    </motion.span>
                  </Button>

                  <Button
                    onClick={onConfirm}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl h-12"
                  >
                    <motion.div
                      className="flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mr-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </motion.div>
                      )}
                      <span className="font-medium">{confirmText}</span>
                    </motion.div>
                  </Button>
                </motion.div>
              </div>

              {/* Barre décorative en bas */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="h-1 bg-gradient-to-r from-rose-200 via-pink-200 to-orange-200"
              />
            </div>
          </motion.div>

          {/* Particules douces flottantes */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full opacity-40"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: i * 0.8,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
