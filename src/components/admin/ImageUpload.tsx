"use client"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Upload, Loader2, ImageIcon, Trash2 } from "lucide-react"

interface ImageUploadProps {
  value?: string | null
  onChange: (url: string) => void
  onDelete?: () => void // Callback opcional para quando a imagem for excluída
  bucket?: string
  folder?: string
  accept?: string
  maxSize?: number // em bytes
  className?: string
  previewClassName?: string
  label?: string
  hint?: string
}

export function ImageUpload({
  value,
  onChange,
  onDelete,
  bucket = "organization",
  folder = "logos",
  accept = "image/png,image/jpeg,image/webp,image/svg+xml",
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
  previewClassName,
  label,
  hint,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // URL de exibição: preview local durante upload ou valor salvo
  const displayUrl = previewUrl || value

  // Função para extrair o path do arquivo da URL do Supabase
  const extractFilePath = (url: string): string | null => {
    try {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split(`/storage/v1/object/public/${bucket}/`)
      if (pathParts.length > 1) {
        return decodeURIComponent(pathParts[1])
      }
    } catch {
      console.error("URL inválida:", url)
    }
    return null
  }

  // Função para remover arquivo do storage
  const removeFromStorage = async (url: string): Promise<boolean> => {
    const filePath = extractFilePath(url)
    if (!filePath) return false

    try {
      const { error } = await supabase.storage.from(bucket).remove([filePath])
      if (error) {
        console.error("Erro ao remover do storage:", error)
        return false
      }
      console.log("Arquivo removido do storage:", filePath)
      return true
    } catch (err) {
      console.error("Erro ao remover arquivo:", err)
      return false
    }
  }

  const handleFileSelect = async (file: File) => {
    setError(null)

    // Validar tipo de arquivo
    const allowedTypes = accept.split(",").map((t) => t.trim())
    if (!allowedTypes.includes(file.type)) {
      setError(`Tipo de arquivo não permitido. Use: ${accept}`)
      return
    }

    // Validar tamanho
    if (file.size > maxSize) {
      setError(`Arquivo muito grande. Máximo: ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }

    setUploading(true)

    // Criar preview local imediato
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl(localPreview)

    // Guardar URL antiga para remover depois do upload bem sucedido
    const oldUrl = value

    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split(".").pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Fazer upload
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "0", // Sem cache para garantir que a imagem mais recente seja exibida
          upsert: false,
        })

      if (uploadError) {
        console.error("Upload error:", uploadError)
        throw uploadError
      }

      console.log("Upload success:", uploadData)

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      // Adicionar timestamp para evitar cache do navegador
      const urlWithTimestamp = `${publicUrl}?t=${Date.now()}`
      
      console.log("Public URL:", urlWithTimestamp)
      onChange(urlWithTimestamp)
      
      // Limpar preview local após sucesso
      setPreviewUrl(null)
      URL.revokeObjectURL(localPreview)

      // Remover imagem antiga do storage (se existir e for do Supabase)
      if (oldUrl && oldUrl.includes("supabase")) {
        // Remover timestamp da URL antiga se houver
        const cleanOldUrl = oldUrl.split("?")[0]
        await removeFromStorage(cleanOldUrl)
      }
    } catch (err: unknown) {
      console.error("Erro no upload:", err)
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer upload. Tente novamente."
      setError(errorMessage)
      // Limpar preview em caso de erro
      setPreviewUrl(null)
      URL.revokeObjectURL(localPreview)
    } finally {
      setUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
    // Limpar input para permitir selecionar o mesmo arquivo novamente
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleRemove = async () => {
    if (!value) return

    setDeleting(true)
    setError(null)

    try {
      // Verificar se é uma URL do Supabase
      if (value.includes("supabase")) {
        // Remover timestamp da URL se houver
        const cleanUrl = value.split("?")[0]
        const removed = await removeFromStorage(cleanUrl)
        if (!removed) {
          console.warn("Não foi possível remover do storage, mas continuando...")
        }
      }

      setPreviewUrl(null)
      onChange("")
      
      // Chamar callback de exclusão se fornecido
      if (onDelete) {
        onDelete()
      }
    } catch (err) {
      console.error("Erro ao remover arquivo:", err)
      setError("Erro ao remover arquivo")
    } finally {
      setDeleting(false)
    }
  }

  const isExternalUrl = displayUrl && !displayUrl.includes("supabase")
  const isLocalFile = displayUrl && displayUrl.startsWith("/")
  const canDelete = displayUrl && !isExternalUrl && !isLocalFile && !previewUrl

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}

      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-colors",
          dragOver
            ? "border-verde bg-verde/5"
            : "border-gray-300 hover:border-gray-400",
          uploading && "pointer-events-none opacity-50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {displayUrl ? (
          <div className="relative p-4">
            <div
              className={cn(
                "flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden",
                previewClassName || "h-32"
              )}
            >
              <img
                src={displayUrl}
                alt="Preview"
                className="max-h-full max-w-full object-contain"
                key={displayUrl}
              />
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={uploading || deleting}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Trocar imagem
                  </>
                )}
              </Button>
              {canDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  disabled={uploading || deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Excluindo...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center p-8 cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="h-10 w-10 text-verde animate-spin mb-3" />
                <p className="text-sm text-gray-600">Enviando...</p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full mb-3">
                  <ImageIcon className="h-7 w-7 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Clique para fazer upload
                </p>
                <p className="text-xs text-gray-500">
                  ou arraste e solte aqui
                </p>
              </>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {hint && !error && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
