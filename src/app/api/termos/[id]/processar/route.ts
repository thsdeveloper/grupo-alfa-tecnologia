/**
 * API Route: Processar itens de um Termo (Normalização + Matching)
 * 
 * POST /api/termos/[id]/processar
 * 
 * Processa os itens pendentes do termo:
 * 1. Normaliza descrições usando LLM
 * 2. Busca equipamentos candidatos
 * 3. Faz matching e gera sugestões
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { normalizarItem, executarMatching } from '@/lib/services/termos'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    // Verificar se o termo existe
    const { data: termo, error: termoError } = await supabase
      .from('termos')
      .select('id, status, user_id')
      .eq('id', id)
      .single()
    
    if (termoError || !termo) {
      return NextResponse.json(
        { error: 'Termo não encontrado' },
        { status: 404 }
      )
    }
    
    // Buscar itens pendentes
    const { data: itens, error: itensError } = await supabase
      .from('termo_itens')
      .select(`
        id,
        numero_item,
        descricao_bruta,
        status,
        termo_grupos (nome)
      `)
      .eq('termo_id', id)
      .in('status', ['pendente', 'normalizado'])
      .order('numero_item', { ascending: true })
    
    if (itensError) {
      return NextResponse.json(
        { error: 'Erro ao buscar itens' },
        { status: 500 }
      )
    }
    
    if (!itens || itens.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhum item pendente para processar',
        processados: 0,
      })
    }
    
    // Atualizar status do termo
    await supabase
      .from('termos')
      .update({ status: 'processando' })
      .eq('id', id)
    
    let processados = 0
    let erros = 0
    const resultados: Array<{
      item_id: string
      numero_item: number
      status: string
      sugestoes: number
    }> = []
    
    // Processar cada item
    for (const item of itens) {
      const startTime = Date.now()
      
      try {
        // 1. Normalizar descrição
        const contextoGrupo = item.termo_grupos 
          ? (item.termo_grupos as { nome: string }).nome 
          : undefined
        
        const dadosNormalizados = await normalizarItem(
          item.descricao_bruta,
          contextoGrupo
        )
        
        // Salvar dados normalizados
        const { error: normError } = await supabase
          .from('termo_itens_normalizados')
          .upsert({
            item_id: item.id,
            categoria: dadosNormalizados.categoria,
            tecnologia: dadosNormalizados.tecnologia,
            formato: dadosNormalizados.formato,
            tipo_lente: dadosNormalizados.tipo_lente,
            ptz: dadosNormalizados.ptz,
            varifocal: dadosNormalizados.varifocal,
            resolucao_min_mp: dadosNormalizados.resolucao_min_mp,
            poe: dadosNormalizados.poe,
            ir_metros: dadosNormalizados.ir_metros,
            potencia_va: dadosNormalizados.potencia_va,
            portas: dadosNormalizados.portas,
            velocidade: dadosNormalizados.velocidade,
            capacidade_armazenamento_tb: dadosNormalizados.capacidade_armazenamento_tb,
            observacoes: dadosNormalizados.observacoes,
            confidence: dadosNormalizados.confidence,
            raw_response: JSON.parse(JSON.stringify(dadosNormalizados)),
          }, {
            onConflict: 'item_id',
          })
        
        if (normError) {
          throw new Error(`Erro ao salvar normalização: ${normError.message}`)
        }
        
        // Atualizar status do item
        await supabase
          .from('termo_itens')
          .update({ status: 'normalizado' })
          .eq('id', item.id)
        
        // Log da normalização
        await supabase.from('process_logs').insert({
          termo_id: id,
          item_id: item.id,
          etapa: 'normalizacao',
          status: 'sucesso',
          mensagem: `Categoria: ${dadosNormalizados.categoria}, Confidence: ${dadosNormalizados.confidence}`,
          duracao_ms: Date.now() - startTime,
        })
        
        // 2. Executar matching
        const matchingStart = Date.now()
        const sugestoes = await executarMatching(
          dadosNormalizados,
          item.descricao_bruta
        )
        
        // Remover sugestões anteriores
        await supabase
          .from('termo_sugestoes')
          .delete()
          .eq('item_id', item.id)
        
        // Salvar novas sugestões
        if (sugestoes.length > 0) {
          const sugestoesParaInserir = sugestoes.map(s => ({
            item_id: item.id,
            equipamento_id: s.equipamento_id,
            is_principal: s.is_principal,
            aderencia_percentual: s.aderencia_percentual,
            comentario: s.comentario,
            ranking: s.ranking,
          }))
          
          await supabase.from('termo_sugestoes').insert(sugestoesParaInserir)
        }
        
        // Atualizar status do item
        await supabase
          .from('termo_itens')
          .update({ status: 'sugerido' })
          .eq('id', item.id)
        
        // Log do matching
        await supabase.from('process_logs').insert({
          termo_id: id,
          item_id: item.id,
          etapa: 'matching',
          status: 'sucesso',
          mensagem: `${sugestoes.length} sugestões encontradas`,
          duracao_ms: Date.now() - matchingStart,
        })
        
        processados++
        resultados.push({
          item_id: item.id,
          numero_item: item.numero_item,
          status: 'sucesso',
          sugestoes: sugestoes.length,
        })
        
      } catch (itemError) {
        console.error(`Erro ao processar item ${item.id}:`, itemError)
        erros++
        
        // Atualizar status do item
        await supabase
          .from('termo_itens')
          .update({ status: 'erro' })
          .eq('id', item.id)
        
        // Log do erro
        await supabase.from('process_logs').insert({
          termo_id: id,
          item_id: item.id,
          etapa: 'normalizacao',
          status: 'erro',
          mensagem: itemError instanceof Error ? itemError.message : 'Erro desconhecido',
          duracao_ms: Date.now() - startTime,
        })
        
        resultados.push({
          item_id: item.id,
          numero_item: item.numero_item,
          status: 'erro',
          sugestoes: 0,
        })
      }
      
      // Pequeno delay entre itens para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 300))
    }
    
    // Atualizar status final do termo
    const statusFinal = erros === itens.length ? 'erro' : 'processado'
    await supabase
      .from('termos')
      .update({ status: statusFinal })
      .eq('id', id)
    
    return NextResponse.json({
      success: true,
      message: `Processamento concluído: ${processados} itens processados, ${erros} erros`,
      processados,
      erros,
      total: itens.length,
      resultados,
    })
    
  } catch (error) {
    console.error('Erro geral:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

