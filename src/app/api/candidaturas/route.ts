import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Usar cliente do servidor - as políticas de RLS permitem inserção pública
    const supabase = await createClient()

    const formData = await request.formData()

    // Extrair dados do formulário
    const vaga_id = formData.get("vaga_id") as string
    const nome_completo = formData.get("nome_completo") as string
    const data_nascimento = formData.get("data_nascimento") as string
    const cpf = formData.get("cpf") as string
    const telefone = formData.get("telefone") as string
    const endereco_completo = formData.get("endereco_completo") as string
    const escolaridade = formData.get("escolaridade") as string
    const possui_experiencia = formData.get("possui_experiencia") === "true"
    const possui_cnh = formData.get("possui_cnh") === "true"
    const tipo_cnh = formData.get("tipo_cnh") as string | null
    const cenario_atual = formData.get("cenario_atual") as string
    const pretensao_salarial = formData.get("pretensao_salarial")
      ? parseFloat(formData.get("pretensao_salarial") as string)
      : null
    const indicacao = formData.get("indicacao") as string | null
    const curriculo = formData.get("curriculo") as File

    // Validações básicas
    if (!vaga_id || !nome_completo || !data_nascimento || !cpf || !telefone || 
        !endereco_completo || !escolaridade || !cenario_atual || !curriculo) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos" },
        { status: 400 }
      )
    }

    // Validar se é PDF
    if (curriculo.type !== "application/pdf") {
      return NextResponse.json(
        { error: "O currículo deve ser um arquivo PDF" },
        { status: 400 }
      )
    }

    // Validar tamanho (5MB)
    if (curriculo.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "O arquivo deve ter no máximo 5MB" },
        { status: 400 }
      )
    }

    // Verificar se a vaga existe e está ativa
    const { data: vaga, error: vagaError } = await supabase
      .from("vagas")
      .select("id, ativo")
      .eq("id", vaga_id)
      .eq("ativo", true)
      .single()

    if (vagaError || !vaga) {
      return NextResponse.json(
        { error: "Vaga não encontrada ou não está mais disponível" },
        { status: 404 }
      )
    }

    // Limpar CPF para verificação de duplicidade
    const cpfLimpo = cpf.replace(/\D/g, "")

    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const fileName = `${vaga_id}/${cpfLimpo}_${timestamp}.pdf`

    // Converter File para ArrayBuffer para upload
    const fileBuffer = await curriculo.arrayBuffer()

    // Upload do currículo
    const { error: uploadError } = await supabase.storage
      .from("curriculos")
      .upload(fileName, fileBuffer, {
        contentType: "application/pdf",
        upsert: false,
      })

    if (uploadError) {
      console.error("Erro no upload:", uploadError)
      return NextResponse.json(
        { error: "Erro ao fazer upload do currículo. " + uploadError.message },
        { status: 500 }
      )
    }

    // Criar candidatura
    const { data: candidatura, error: candidaturaError } = await supabase
      .from("candidaturas")
      .insert({
        vaga_id,
        nome_completo: nome_completo.trim(),
        data_nascimento,
        cpf: cpfLimpo,
        telefone: telefone.replace(/\D/g, ""),
        endereco_completo: endereco_completo.trim(),
        escolaridade,
        possui_experiencia,
        possui_cnh,
        tipo_cnh: possui_cnh ? tipo_cnh : null,
        cenario_atual,
        pretensao_salarial,
        indicacao: indicacao?.trim() || null,
        curriculo_url: fileName,
        curriculo_nome_original: curriculo.name,
        status: "nova",
      })
      .select()
      .single()

    if (candidaturaError) {
      console.error("Erro ao criar candidatura:", candidaturaError)
      // Tentar remover o arquivo se a candidatura falhou
      await supabase.storage.from("curriculos").remove([fileName])
      return NextResponse.json(
        { error: "Erro ao processar candidatura. " + candidaturaError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Candidatura enviada com sucesso!",
      id: candidatura.id,
    })
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor: " + (error instanceof Error ? error.message : "Erro desconhecido") },
      { status: 500 }
    )
  }
}
