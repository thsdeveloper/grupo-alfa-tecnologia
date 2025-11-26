/**
 * API Route: Gerenciar item específico de um Termo
 * 
 * GET /api/termos/[id]/itens/[itemId] - Detalhes do item
 * PATCH /api/termos/[id]/itens/[itemId] - Atualizar sugestão selecionada
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ id: string; itemId: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, itemId } = await params
    const supabase = await createClient()
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    // Buscar item com dados normalizados e sugestões
    const { data: item, error: itemError } = await supabase
      .from('termo_itens')
      .select(`
        *,
        termo_grupos (id, nome, local),
        termo_itens_normalizados (*),
        termo_sugestoes (
          *,
          equipamentos (*)
        )
      `)
      .eq('id', itemId)
      .eq('termo_id', id)
      .single()
    
    if (itemError || !item) {
      return NextResponse.json(
        { error: 'Item não encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ item })
    
  } catch (error) {
    console.error('Erro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, itemId } = await params
    const supabase = await createClient()
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { equipamento_id, observacoes } = body
    
    // Verificar se o item existe
    const { data: item, error: itemError } = await supabase
      .from('termo_itens')
      .select('id, termo_id')
      .eq('id', itemId)
      .eq('termo_id', id)
      .single()
    
    if (itemError || !item) {
      return NextResponse.json(
        { error: 'Item não encontrado' },
        { status: 404 }
      )
    }
    
    // Se um equipamento foi selecionado, atualizar sugestões
    if (equipamento_id) {
      // Verificar se o equipamento existe
      const { data: equipamento, error: eqError } = await supabase
        .from('equipamentos')
        .select('id')
        .eq('id', equipamento_id)
        .single()
      
      if (eqError || !equipamento) {
        return NextResponse.json(
          { error: 'Equipamento não encontrado' },
          { status: 404 }
        )
      }
      
      // Desmarcar sugestão principal anterior
      await supabase
        .from('termo_sugestoes')
        .update({ is_principal: false, confirmado_por_usuario: false })
        .eq('item_id', itemId)
      
      // Verificar se já existe sugestão para este equipamento
      const { data: sugestaoExistente } = await supabase
        .from('termo_sugestoes')
        .select('id')
        .eq('item_id', itemId)
        .eq('equipamento_id', equipamento_id)
        .single()
      
      if (sugestaoExistente) {
        // Atualizar sugestão existente
        await supabase
          .from('termo_sugestoes')
          .update({
            is_principal: true,
            confirmado_por_usuario: true,
            comentario: observacoes || 'Selecionado manualmente pelo usuário',
          })
          .eq('id', sugestaoExistente.id)
      } else {
        // Criar nova sugestão
        await supabase
          .from('termo_sugestoes')
          .insert({
            item_id: itemId,
            equipamento_id,
            is_principal: true,
            confirmado_por_usuario: true,
            aderencia_percentual: 1.0,
            comentario: observacoes || 'Selecionado manualmente pelo usuário',
            ranking: 0,
          })
      }
      
      // Atualizar status do item
      await supabase
        .from('termo_itens')
        .update({ status: 'confirmado' })
        .eq('id', itemId)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Item atualizado com sucesso',
    })
    
  } catch (error) {
    console.error('Erro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

