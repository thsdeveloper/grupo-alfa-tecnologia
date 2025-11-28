"use client"

import { useState, useRef } from "react"
import { Upload, Loader2, CheckCircle, AlertCircle, FileText } from "lucide-react"

interface CandidaturaFormProps {
  vagaId: string
  vagaTitulo: string
}

const escolaridadeOptions = [
  { value: "fundamental", label: "Ensino Fundamental" },
  { value: "medio", label: "Ensino Médio" },
  { value: "superior", label: "Ensino Superior" },
  { value: "pos_graduacao", label: "Pós-Graduação" },
]

const cenarioOptions = [
  { value: "desempregado", label: "Desempregado" },
  { value: "empregado", label: "Empregado, porém buscando novas oportunidades" },
  { value: "freelancer", label: "Freelancer" },
]

const tipoCnhOptions = [
  { value: "a", label: "A - Moto" },
  { value: "b", label: "B - Carro" },
  { value: "ab", label: "AB - Moto e Carro" },
  { value: "c", label: "C - Caminhão" },
  { value: "d", label: "D - Ônibus" },
  { value: "e", label: "E - Carreta" },
]

export function CandidaturaForm({ vagaId, vagaTitulo }: CandidaturaFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [possuiCnh, setPossuiCnh] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Por favor, selecione um arquivo PDF")
        setSelectedFile(null)
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("O arquivo deve ter no máximo 5MB")
        setSelectedFile(null)
        return
      }
      setError(null)
      setSelectedFile(file)
    }
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1")
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1")
  }

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (!numbers) return ""
    const amount = parseInt(numbers) / 100
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set("vaga_id", vagaId)

    // Limpar CPF e telefone
    const cpf = (formData.get("cpf") as string).replace(/\D/g, "")
    const telefone = (formData.get("telefone") as string).replace(/\D/g, "")
    formData.set("cpf", cpf)
    formData.set("telefone", telefone)

    // Converter pretensão salarial para número
    const pretensaoStr = formData.get("pretensao_salarial") as string
    if (pretensaoStr) {
      const pretensaoNum = parseFloat(pretensaoStr.replace(/\D/g, "")) / 100
      formData.set("pretensao_salarial", pretensaoNum.toString())
    }

    // Adicionar arquivo
    if (selectedFile) {
      formData.set("curriculo", selectedFile)
    }

    try {
      const response = await fetch("/api/candidaturas", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar candidatura")
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar candidatura")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl p-6 lg:p-8 text-center">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-[#211915] mb-2">
          Candidatura Enviada!
        </h3>
        <p className="text-[#211915]/70 mb-6">
          Sua candidatura para a vaga de <strong>{vagaTitulo}</strong> foi recebida com sucesso.
          Entraremos em contato em breve.
        </p>
        <a
          href="/carreiras"
          className="inline-block bg-[#b6c72c] text-[#211915] px-6 py-3 rounded-xl font-semibold hover:bg-[#9eb025] transition-colors"
        >
          Ver Outras Vagas
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8">
      <h2 className="text-xl font-bold text-[#211915] mb-2 font-heading">
        Candidate-se
      </h2>
      <p className="text-[#211915]/60 text-sm mb-6">
        Preencha o formulário abaixo para se candidatar
      </p>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl mb-6 text-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome Completo */}
        <div>
          <label className="block text-sm font-medium text-[#211915] mb-1">
            Nome Completo *
          </label>
          <input
            type="text"
            name="nome_completo"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#b6c72c] focus:ring-1 focus:ring-[#b6c72c] outline-none transition-colors"
            placeholder="Seu nome completo"
          />
        </div>

        {/* Data de Nascimento */}
        <div>
          <label className="block text-sm font-medium text-[#211915] mb-1">
            Data de Nascimento *
          </label>
          <input
            type="date"
            name="data_nascimento"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#b6c72c] focus:ring-1 focus:ring-[#b6c72c] outline-none transition-colors"
          />
        </div>

        {/* CPF */}
        <div>
          <label className="block text-sm font-medium text-[#211915] mb-1">
            CPF *
          </label>
          <input
            type="text"
            name="cpf"
            required
            maxLength={14}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#b6c72c] focus:ring-1 focus:ring-[#b6c72c] outline-none transition-colors"
            placeholder="000.000.000-00"
            onChange={(e) => {
              e.target.value = formatCPF(e.target.value)
            }}
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium text-[#211915] mb-1">
            Telefone *
          </label>
          <input
            type="text"
            name="telefone"
            required
            maxLength={15}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#b6c72c] focus:ring-1 focus:ring-[#b6c72c] outline-none transition-colors"
            placeholder="(00) 00000-0000"
            onChange={(e) => {
              e.target.value = formatPhone(e.target.value)
            }}
          />
        </div>

        {/* Endereço Completo */}
        <div>
          <label className="block text-sm font-medium text-[#211915] mb-1">
            Endereço Completo *
          </label>
          <textarea
            name="endereco_completo"
            required
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#b6c72c] focus:ring-1 focus:ring-[#b6c72c] outline-none transition-colors resize-none"
            placeholder="Rua, número, bairro, cidade - UF"
          />
        </div>

        {/* Escolaridade */}
        <div>
          <label className="block text-sm font-medium text-[#211915] mb-1">
            Escolaridade *
          </label>
          <select
            name="escolaridade"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#b6c72c] focus:ring-1 focus:ring-[#b6c72c] outline-none transition-colors bg-white"
          >
            <option value="">Selecione...</option>
            {escolaridadeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Possui Experiência */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="possui_experiencia"
              value="true"
              className="w-5 h-5 rounded border-gray-300 text-[#b6c72c] focus:ring-[#b6c72c]"
            />
            <span className="text-sm text-[#211915]">
              Possui experiência na área
            </span>
          </label>
        </div>

        {/* CNH */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="possui_cnh"
              value="true"
              checked={possuiCnh}
              onChange={(e) => setPossuiCnh(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-[#b6c72c] focus:ring-[#b6c72c]"
            />
            <span className="text-sm text-[#211915]">
              Possui Carteira de Habilitação (CNH)
            </span>
          </label>

          {possuiCnh && (
            <select
              name="tipo_cnh"
              required={possuiCnh}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#b6c72c] focus:ring-1 focus:ring-[#b6c72c] outline-none transition-colors bg-white"
            >
              <option value="">Selecione a categoria...</option>
              {tipoCnhOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Cenário Atual */}
        <div>
          <label className="block text-sm font-medium text-[#211915] mb-2">
            Cenário Atual *
          </label>
          <div className="space-y-2">
            {cenarioOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="cenario_atual"
                  value={opt.value}
                  required
                  className="w-5 h-5 border-gray-300 text-[#b6c72c] focus:ring-[#b6c72c]"
                />
                <span className="text-sm text-[#211915]">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Pretensão Salarial */}
        <div>
          <label className="block text-sm font-medium text-[#211915] mb-1">
            Pretensão Salarial
          </label>
          <input
            type="text"
            name="pretensao_salarial"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#b6c72c] focus:ring-1 focus:ring-[#b6c72c] outline-none transition-colors"
            placeholder="R$ 0,00"
            onChange={(e) => {
              e.target.value = formatCurrency(e.target.value)
            }}
          />
        </div>

        {/* Indicação */}
        <div>
          <label className="block text-sm font-medium text-[#211915] mb-1">
            Indicação
          </label>
          <input
            type="text"
            name="indicacao"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#b6c72c] focus:ring-1 focus:ring-[#b6c72c] outline-none transition-colors"
            placeholder="Quem indicou você?"
          />
        </div>

        {/* Upload Currículo */}
        <div>
          <label className="block text-sm font-medium text-[#211915] mb-1">
            Currículo (PDF) *
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              selectedFile
                ? "border-[#b6c72c] bg-[#b6c72c]/5"
                : "border-gray-200 hover:border-[#b6c72c]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {selectedFile ? (
              <div className="flex items-center justify-center gap-2 text-[#b6c72c]">
                <FileText className="h-5 w-5" />
                <span className="font-medium">{selectedFile.name}</span>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  Clique para selecionar ou arraste o arquivo
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF até 5MB</p>
              </>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !selectedFile}
          className="w-full bg-[#b6c72c] text-[#211915] py-4 rounded-xl font-bold hover:bg-[#9eb025] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar Candidatura"
          )}
        </button>

        <p className="text-xs text-[#211915]/50 text-center">
          Ao enviar, você concorda com nossa política de privacidade e tratamento de dados.
        </p>
      </form>
    </div>
  )
}

