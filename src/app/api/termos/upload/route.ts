/**
 * API Route: Upload de PDF de Termo de Referência
 * 
 * POST /api/termos/upload
 * 
 * Recebe um arquivo PDF, faz o upload para o Supabase Storage,
 * cria o registro do termo e inicia o processamento.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parsePDF } from '@/lib/services/termos'
import { checkApiPermission } from '@/lib/permissions/middleware'

export async function POST(request: NextRequest) {
  try {
    // Verificar permissão para criar termos
    const { authorized, userId, error: permError } = await checkApiPermission(request, 'termos', 'create')
    if (!authorized) {
      return permError!
    }
    
    const supabase = await createClient()
    
    // Obter dados do usuário para o user_id
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    // Obter arquivo do FormData
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const nome = formData.get('nome') as string | null
    
    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo PDF não fornecido' },
        { status: 400 }
      )
    }
    
    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Apenas arquivos PDF são aceitos' },
        { status: 400 }
      )
    }
    
    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const fileName = `${user.id}/${timestamp}-${file.name}`
    
    // Converter File para Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('termos-pdfs')
      .upload(fileName, buffer, {
        contentType: 'application/pdf',
        upsert: false,
      })
    
    if (uploadError) {
      console.error('Erro no upload:', uploadError)
      return NextResponse.json(
        { error: 'Erro ao fazer upload do arquivo' },
        { status: 500 }
      )
    }
    
    // Obter URL pública do arquivo
    const { data: urlData } = supabase.storage
      .from('termos-pdfs')
      .getPublicUrl(fileName)
    
    // Criar registro do termo
    const { data: termo, error: termoError } = await supabase
      .from('termos')
      .insert({
        nome: nome || file.name.replace(/\.pdf$/i, ''),
        pdf_url: urlData.publicUrl,
        pdf_nome_original: file.name,
        status: 'processando',
        user_id: user.id,
      })
      .select()
      .single()
    
    if (termoError) {
      console.error('Erro ao criar termo:', termoError)
      return NextResponse.json(
        { error: 'Erro ao criar registro do termo' },
        { status: 500 }
      )
    }
    
    // Log de início do processamento
    await supabase.from('process_logs').insert({
      termo_id: termo.id,
      etapa: 'upload',
      status: 'sucesso',
      mensagem: `Arquivo ${file.name} enviado com sucesso`,
    })
    
    // Iniciar parsing do PDF (síncrono para MVP)
    try {
      const startTime = Date.now()
      console.log('Iniciando parsing do PDF:', file.name, 'Tamanho:', buffer.length)
      
      const resultado = await parsePDF(buffer, file.name)
      const duracao = Date.now() - startTime
      
      console.log('Parsing concluído em', duracao, 'ms. Grupos:', resultado.grupos.length)
      
      // Log do parsing
      await supabase.from('process_logs').insert({
        termo_id: termo.id,
        etapa: 'parsing',
        status: 'sucesso',
        mensagem: `Extraídos ${resultado.grupos.length} grupos`,
        duracao_ms: duracao,
        detalhes: {
          grupos: resultado.grupos.length,
          total_itens: resultado.grupos.reduce((acc, g) => acc + g.itens.length, 0),
        },
      })
      
      // Atualizar termo com metadados
      await supabase
        .from('termos')
        .update({
          numero_edital: resultado.numero_edital,
          orgao: resultado.orgao,
          total_grupos: resultado.grupos.length,
          total_itens: resultado.grupos.reduce((acc, g) => acc + g.itens.length, 0),
        })
        .eq('id', termo.id)
      
      // Criar grupos e itens
      for (const grupo of resultado.grupos) {
        const { data: grupoDb, error: grupoError } = await supabase
          .from('termo_grupos')
          .insert({
            termo_id: termo.id,
            numero: grupo.numero,
            nome: grupo.nome,
            local: grupo.local,
          })
          .select()
          .single()
        
        if (grupoError) {
          console.error('Erro ao criar grupo:', grupoError)
          continue
        }
        
        // Criar itens do grupo
        const itensParaInserir = grupo.itens.map(item => ({
          termo_id: termo.id,
          grupo_id: grupoDb.id,
          numero_item: item.numero_item,
          descricao_bruta: item.descricao_bruta,
          unidade: item.unidade,
          quantidade: item.quantidade,
          valor_estimado: item.valor_estimado,
          status: 'pendente',
        }))
        
        if (itensParaInserir.length > 0) {
          await supabase.from('termo_itens').insert(itensParaInserir)
        }
      }
      
      // Atualizar status do termo
      await supabase
        .from('termos')
        .update({ status: 'processado' })
        .eq('id', termo.id)
      
      return NextResponse.json({
        success: true,
        termo_id: termo.id,
        nome: termo.nome,
        grupos: resultado.grupos.length,
        itens: resultado.grupos.reduce((acc, g) => acc + g.itens.length, 0),
        message: 'PDF processado com sucesso',
      })
      
    } catch (parseError) {
      const errorMessage = parseError instanceof Error ? parseError.message : 'Erro desconhecido'
      const errorStack = parseError instanceof Error ? parseError.stack : undefined
      
      console.error('Erro no parsing do PDF:', {
        message: errorMessage,
        stack: errorStack,
        fileName: file.name,
        bufferSize: buffer.length,
      })
      
      // Log do erro
      await supabase.from('process_logs').insert({
        termo_id: termo.id,
        etapa: 'parsing',
        status: 'erro',
        mensagem: errorMessage,
        detalhes: { stack: errorStack },
      })
      
      // Atualizar status do termo
      await supabase
        .from('termos')
        .update({ status: 'erro' })
        .eq('id', termo.id)
      
      return NextResponse.json({
        success: false,
        termo_id: termo.id,
        error: `Erro ao processar PDF: ${errorMessage}`,
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Erro geral:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

